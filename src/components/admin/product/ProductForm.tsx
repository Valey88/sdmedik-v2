import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "./RichTextEditor";
import { useCategories } from "@/hooks/useCategories";
import { useAdmin } from "@/hooks/useAdmin";
import { Loader2, X, UploadCloud } from "lucide-react";
import { urlPictures } from "@/config/Config";
import { useNavigate } from "react-router-dom";

// --- Zod Schema ---
const productSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  article: z.string().optional(),
  tru: z.string().optional(),
  price: z.coerce.number().min(0, "Цена должна быть больше 0"),
  description: z.string().min(1, "Описание обязательно"),
  category_ids: z.array(z.number()),
  catalogs: z.array(z.number()), // 1 - Каталог, 2 - Эл. сертификат
  preview: z.string().optional(),
  nameplate: z.string().optional(),
  // Характеристики храним как массив объектов
  characteristics: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      value: z.string(), // храним как строку через запятую для простоты редактирования
      prices: z.string().optional(), // для размеров
      isSize: z.boolean().optional(),
      dataType: z.string().optional(),
    })
  ),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any; // Если есть данные, значит режим редактирования
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const navigate = useNavigate();
  const { categories, refetch: fetchCategories } = useCategories();
  const { createProduct, updateProduct, loading } = useAdmin();

  // Локальные стейты для картинок
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  // Храним объекты {id, name}, а не просто ID
  const [deletedImages, setDeletedImages] = useState<
    { id: string; name: string }[]
  >([]);

  // Флаги UI
  const [isElectronicCertificate, setIsElectronicCertificate] = useState(false);
  const [isNameplate, setIsNameplate] = useState(false);

  const form = useForm<ProductFormValues>({
    // Исправление ошибки типов TS: приводим резолвер к any, так как Zod инферит типы корректно в рантайме
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: "",
      article: "",
      tru: "",
      price: 0,
      description: "",
      category_ids: [],
      catalogs: [],
      preview: "",
      nameplate: "",
      characteristics: [],
    },
  });

  // Загрузка категорий
  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Вспомогательная функция для преобразования характеристик ---
  const mapInitialCharacteristics = (chars: any[]) => {
    if (!chars) return [];
    return chars.map((c) => ({
      id: c.id,
      name: c.name,
      value: Array.isArray(c.value)
        ? c.value.join(", ")
        : String(c.value || ""),
      prices: Array.isArray(c.prices) ? c.prices.join(", ") : "",
      isSize: c.name.toLowerCase() === "размер",
      dataType: c.data_type || "string",
    }));
  };

  // Инициализация данных при редактировании
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        article: initialData.article || "",
        tru: initialData.tru || "",
        price: initialData.price || 0,
        description: initialData.description || "",

        // Маппинг категорий (объекты -> ID)
        category_ids: initialData.categories
          ? initialData.categories.map((c: any) => c.id)
          : [],

        // Маппинг каталогов (число -> массив)
        catalogs: initialData.catalogs ? [initialData.catalogs] : [],

        preview: initialData.preview || "",
        nameplate: initialData.nameplate || "",
        characteristics: mapInitialCharacteristics(initialData.characteristic),
      });

      if (initialData.images && initialData.images.length > 0) {
        setExistingImages(initialData.images);
      }

      if (initialData.preview) setIsElectronicCertificate(true);
      if (initialData.nameplate) setIsNameplate(true);
    }
  }, [initialData, form]);

  // Следим за выбранными категориями для подгрузки характеристик
  const selectedCategoryIds = form.watch("category_ids");

  useEffect(() => {
    const availableChars: any[] = [];
    selectedCategoryIds.forEach((catId) => {
      const category = categories.find((c) => c.id === catId);
      if (category && category.characteristic) {
        category.characteristic.forEach((char) => {
          if (!availableChars.find((ex) => ex.id === char.id)) {
            availableChars.push(char);
          }
        });
      }
    });

    const currentFormChars = form.getValues("characteristics") || [];

    const newCharsField = availableChars.map((char) => {
      const existing = currentFormChars.find((c) => c.id === char.id);
      return {
        id: char.id,
        name: char.name,
        value: existing ? existing.value : "",
        prices: existing ? existing.prices : "",
        isSize: char.name.toLowerCase() === "размер",
        dataType: char.data_type,
      };
    });

    if (
      selectedCategoryIds.length > 0 &&
      currentFormChars.length !== newCharsField.length
    ) {
      form.setValue("characteristics", newCharsField);
    }
  }, [selectedCategoryIds, categories, form]);

  // Обработка файлов
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (image: { id: string; name: string }) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
    setDeletedImages((prev) => [...prev, { id: image.id, name: image.name }]);
  };

  // Отправка формы (Исправлен тип SubmitHandler)
  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    const formData = new FormData();

    const characteristicValues = values.characteristics
      .filter((c) => c.value.trim() !== "")
      .map((c) => {
        const valArray =
          c.dataType === "bool"
            ? [c.value]
            : c.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

        const result: any = {
          characteristic_id: c.id,
          value: valArray,
        };

        if (c.isSize && c.prices) {
          result.prices = c.prices
            .split(",")
            .map((p) => Number(p.trim()))
            .filter((n) => !isNaN(n));
        }
        return result;
      });

    const payload = {
      ...values,
      characteristic_values: characteristicValues,
      del_images: deletedImages,
    };

    formData.append("json", JSON.stringify(payload));

    newImages.forEach((file) => {
      formData.append("files", file);
    });

    let success = false;
    if (isEdit && initialData?.id) {
      success = await updateProduct(initialData.id, formData);
    } else {
      success = await createProduct(formData);
    }

    if (success) {
      navigate("/admin/products");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 max-w-5xl mx-auto pb-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка: Основная информация */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Название товара</Label>
                <Input
                  {...form.register("name")}
                  placeholder="Например: Инвалидная коляска..."
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Артикул</Label>
                  <Input {...form.register("article")} />
                </div>
                <div className="grid gap-2">
                  <Label>ТРУ код</Label>
                  <Input {...form.register("tru")} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Цена (₽)</Label>
                <Input type="number" {...form.register("price")} />
              </div>

              <div className="grid gap-2">
                <Label>Описание</Label>
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Характеристики (Динамические) */}
          <Card>
            <CardHeader>
              <CardTitle>Характеристики</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("characteristics")?.length === 0 && (
                <p className="text-slate-500 text-sm">
                  Выберите категорию, чтобы появились характеристики.
                </p>
              )}
              {form.watch("characteristics")?.map((char, index) => (
                <div
                  key={char.id}
                  className="grid gap-2 p-3 border rounded-md bg-slate-50"
                >
                  <Label className="font-semibold">{char.name}</Label>

                  {/* Если bool - чекбокс, иначе input */}
                  {char.dataType === "bool" ? (
                    <Controller
                      name={`characteristics.${index}.value`}
                      control={form.control}
                      render={({ field }) => (
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`char-${index}-true`}
                              checked={field.value === "true"}
                              onCheckedChange={() => field.onChange("true")}
                            />
                            <label htmlFor={`char-${index}-true`}>Да</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`char-${index}-false`}
                              checked={field.value === "false"}
                              onCheckedChange={() => field.onChange("false")}
                            />
                            <label htmlFor={`char-${index}-false`}>Нет</label>
                          </div>
                        </div>
                      )}
                    />
                  ) : (
                    <Input
                      {...form.register(`characteristics.${index}.value`)}
                      placeholder="Значения через запятую (красный, синий)"
                    />
                  )}

                  {/* Доп поле для цен, если это Размер */}
                  {char.isSize && (
                    <Input
                      {...form.register(`characteristics.${index}.prices`)}
                      placeholder="Цены для размеров через запятую (1000, 1200)"
                      className="mt-2"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка: Настройки, Категории, Фото */}
        <div className="space-y-6">
          {/* Статус и Каталоги */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Каталоги</Label>
                <div className="flex flex-col gap-2">
                  <Controller
                    name="catalogs"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value.includes(1)}
                            onCheckedChange={(checked) => {
                              const newVal = checked
                                ? [...field.value, 1]
                                : field.value.filter((v) => v !== 1);
                              field.onChange(newVal);
                            }}
                          />
                          <Label>Основной каталог</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value.includes(2)}
                            onCheckedChange={(checked) => {
                              const newVal = checked
                                ? [...field.value, 2]
                                : field.value.filter((v) => v !== 2);
                              field.onChange(newVal);
                            }}
                          />
                          <Label>Электронный сертификат</Label>
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={isElectronicCertificate}
                    onCheckedChange={(v) => setIsElectronicCertificate(!!v)}
                  />
                  <Label>Шильд (Превью текст)</Label>
                </div>
                {isElectronicCertificate && (
                  <Input
                    {...form.register("preview")}
                    placeholder="Текст шильда"
                  />
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={isNameplate}
                    onCheckedChange={(v) => setIsNameplate(!!v)}
                  />
                  <Label>Nameplate</Label>
                </div>
                {isNameplate && (
                  <Input
                    {...form.register("nameplate")}
                    placeholder="Текст nameplate"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Категории */}
          <Card>
            <CardHeader>
              <CardTitle>Категории</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                <Controller
                  name="category_ids"
                  control={form.control}
                  render={({ field }) => (
                    <>
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={field.value.includes(cat.id)}
                            onCheckedChange={(checked) => {
                              const newVal = checked
                                ? [...field.value, cat.id]
                                : field.value.filter((id) => id !== cat.id);
                              field.onChange(newVal);
                            }}
                          />
                          <Label className="font-normal cursor-pointer">
                            {cat.name}
                          </Label>
                        </div>
                      ))}
                    </>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Изображения */}
          <Card>
            <CardHeader>
              <CardTitle>Изображения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* Существующие */}
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-square border rounded-md overflow-hidden group"
                  >
                    <img
                      src={`${urlPictures}/${img.name}`}
                      alt=""
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      // ИСПРАВЛЕНИЕ: Передаем весь объект
                      onClick={() => removeExistingImage(img)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {/* Новые */}
                {newImages.map((file, i) => (
                  <div
                    key={i}
                    className="relative aspect-square border rounded-md overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500 font-semibold">
                      Нажмите для загрузки
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4 fixed bottom-0 right-0 w-full bg-white p-4 border-t shadow-lg z-10 md:pl-64">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/products")}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#00B3A4] hover:bg-[#009688]"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Сохранить изменения" : "Создать товар"}
        </Button>
      </div>
    </form>
  );
}
