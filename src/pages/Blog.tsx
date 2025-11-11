import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  tags: string[];
}

const Blog = () => {
  const posts: BlogPost[] = [
    {
      id: "1",
      title: "Как выбрать инвалидное кресло-коляску",
      excerpt:
        "Подробное руководство по выбору кресла-коляски с учетом индивидуальных потребностей пациента.",
      image:
        "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=600&h=400&fit=crop",
      date: "20.01.2025",
      readTime: "5 мин",
      tags: ["Кресла-коляски", "Советы"],
    },
    {
      id: "2",
      title: "Уход за медицинской кроватью в домашних условиях",
      excerpt:
        "Практические рекомендации по эксплуатации и обслуживанию медицинских кроватей.",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
      date: "18.01.2025",
      readTime: "7 мин",
      tags: ["Медтехника", "Уход"],
    },
    {
      id: "3",
      title: "Профилактика пролежней: полное руководство",
      excerpt:
        "Методы профилактики и современные средства для предотвращения образования пролежней.",
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
      date: "15.01.2025",
      readTime: "10 мин",
      tags: ["Уход", "Профилактика"],
    },
    {
      id: "4",
      title: "Новинки медицинского оборудования 2025",
      excerpt:
        "Обзор новейших технологий и оборудования в сфере реабилитации и ухода за больными.",
      image:
        "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600&h=400&fit=crop",
      date: "10.01.2025",
      readTime: "8 мин",
      tags: ["Новинки", "Технологии"],
    },
    {
      id: "5",
      title: "Ортопедические изделия: как сделать правильный выбор",
      excerpt:
        "Руководство по выбору бандажей, корсетов и других ортопедических изделий.",
      image:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=400&fit=crop",
      date: "05.01.2025",
      readTime: "6 мин",
      tags: ["Ортопедия", "Советы"],
    },
    {
      id: "6",
      title: "Реабилитация после инсульта: оборудование и методы",
      excerpt:
        "Обзор необходимого оборудования для эффективной реабилитации после инсульта.",
      image:
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=400&fit=crop",
      date: "01.01.2025",
      readTime: "12 мин",
      tags: ["Реабилитация", "Медтехника"],
    },
  ];

  return (
    <main className="min-h-screen bg-teal-50">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#00B3A4]/20 via-[#33C4B5]/10 to-[#66D1C6]/20 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 text-[#006e66]">Блог</h1>
          <p className="text-xl text-teal-800/70 max-w-2xl">
            Полезные статьи о медицинском оборудовании, уходе за больными и
            новинках в сфере здравоохранения
          </p>
        </div>
      </div>

      {/* POSTS GRID */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="group block">
              <Card className="h-full overflow-hidden rounded-xl shadow-md shadow-teal-200/40 hover:shadow-xl hover:shadow-teal-300/40 transition-all duration-300 bg-white border border-teal-200">
                {/* IMAGE */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <CardContent className="p-6">
                  {/* TAGS */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-teal-100 text-teal-800 border border-teal-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2 text-teal-900 group-hover:text-[#00B3A4] transition-colors">
                    {post.title}
                  </h3>

                  {/* EXCERPT */}
                  <p className="text-teal-800/70 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* META */}
                  <div className="flex items-center justify-between text-sm text-teal-700">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-[#00B3A4]" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-[#00B3A4]" />
                        {post.readTime}
                      </span>
                    </div>

                    <ArrowRight className="h-4 w-4 text-[#00B3A4] group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Blog;
