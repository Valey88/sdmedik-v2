import { useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, UploadCloud, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";

// --- Zod Schema ---
const categorySchema = z.object({
  name: z.string().min(1, "Название категории обязательно"),
  characteristics: z.array(
    z.object({
      id: z.number().optional(), // ID для существующих
      name: z.string().min(1, "Название характеристики обязательно"),
      data_type: z.string().min(1, "Выберите тип данных"),
    }),
  ),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function CategoryForm({
  initialData,
  isEdit,
}: CategoryFormProps) {
  const navigate = useNavigate();
  const { createCategory, updateCategory, loading } = useCategories();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      characteristics: [{ name: "", data_type: "string" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "characteristics",
  });

  // Инициализация при редактировании
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        characteristics: initialData.characteristic
          ? initialData.characteristic.map((c: any) => ({
              id: c.id,
              name: c.name,
              data_type: c.data_type || "string",
            }))
          : [],
      });
      // Если у категории есть картинка (обычно массив images)
      // Здесь можно добавить логику отображения существующей картинки, если API отдает URL
    }
  }, [initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const onSubmit: SubmitHandler<CategoryFormValues> = async (values) => {
    let success = false;

    if (isEdit && initialData?.id) {
      // --- РЕДАКТИРОВАНИЕ (JSON) ---
      const updatePayload = {
        name: values.name,
        characteristics: values.characteristics.map((c) => ({
          category_id: Number(initialData.id),
          data_type: c.data_type,
          id: c.id || 0, // 0 для новых
          name: c.name,
        })),
      };
      success = await updateCategory(initialData.id, updatePayload);
    } else {
      // --- СОЗДАНИЕ (FormData) ---
      const formData = new FormData();
      const categoryData = {
        name: values.name,
        characteristics: values.characteristics.map((c) => ({
          data_type: c.data_type,
          name: c.name,
        })),
      };

      formData.append("json", JSON.stringify(categoryData));
      if (image) {
        formData.append("file", image);
      }

      success = await createCategory(formData);
    }

    if (success) {
      navigate("/admin/categories");
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto pb-20"
    >
      {/* Основная информация */}
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название категории</Label>
            <Input
              id="name"
              placeholder="Например: Инвалидные коляски"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Загрузка фото (только при создании, если API обновления не поддерживает файлы) */}
          {!isEdit && (
            <div className="grid gap-2">
              <Label>Изображение категории</Label>
              {preview ? (
                <div className="relative w-40 h-40 border rounded-lg overflow-hidden group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                    <p className="text-sm text-slate-500 font-medium">
                      Нажмите для загрузки
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Характеристики */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Характеристики</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: "", data_type: "string" })}
          >
            <Plus className="mr-2 h-4 w-4" /> Добавить
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 items-start bg-slate-50 p-3 rounded-lg border"
            >
              <div className="flex-1 grid gap-2">
                <Label className="text-xs text-slate-500">Название</Label>
                <Input
                  {...form.register(`characteristics.${index}.name`)}
                  placeholder="Например: Вес"
                  className="bg-white"
                />
                {form.formState.errors.characteristics?.[index]?.name && (
                  <p className="text-red-500 text-xs">
                    {
                      form.formState.errors.characteristics[index]?.name
                        ?.message
                    }
                  </p>
                )}
              </div>
              <div className="w-[180px] grid gap-2">
                <Label className="text-xs text-slate-500">Тип данных</Label>
                <Select
                  onValueChange={(val) =>
                    form.setValue(`characteristics.${index}.data_type`, val)
                  }
                  defaultValue={field.data_type}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">Текст (String)</SelectItem>
                    <SelectItem value="int">Целое число (Int)</SelectItem>
                    <SelectItem value="float">Дробное (Float)</SelectItem>
                    <SelectItem value="bool">Да/Нет (Bool)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-center text-slate-500 py-4 text-sm">
              Нет характеристик. Добавьте первую.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/categories")}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#00B3A4] hover:bg-[#009688]"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Сохранить изменения" : "Создать категорию"}
        </Button>
      </div>
    </form>
  );
}
