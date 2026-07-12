import "dotenv/config";
import { db } from "./index";
import { categories, articles } from "./schema";

const CATEGORIES = [
  { slug: "siyaset", name: "Siyasət", color: "#C0392B" },
  { slug: "iqtisadiyyat", name: "İqtisadiyyat", color: "#2C5F5F" },
  { slug: "dunya", name: "Dünya", color: "#3F5D8A" },
  { slug: "idman", name: "İdman", color: "#1E8449" },
  { slug: "medeniyyet", name: "Mədəniyyət", color: "#8E44AD" },
  { slug: "texnologiya", name: "Texnologiya", color: "#B7791F" },
];

const ARTICLES = [
  {
    title: "Paytaxtda yeni metro xəttinin tikintisinə start verildi",
    excerpt: "Layihəyə əsasən yeni xətt 12 stansiyadan ibarət olacaq və 2028-ci ildə istismara veriləcək.",
    content:
      "Şəhər İcra Hakimiyyəti tərəfindən açıqlanan məlumata görə, yeni metro xəttinin tikintisinə rəsmi start verilib. Layihə çərçivəsində 12 yeni stansiya inşa olunacaq.\n\nTikinti işləri üç mərhələdə aparılacaq. Birinci mərhələ 2026-cı ilin sonunadək başa çatdırılacaq.\n\nEkspertlər bildirir ki, yeni xəttin istifadəyə verilməsi ilə şəhər daxilində nəqliyyat sıxlığı azalacaq.",
    categorySlug: "iqtisadiyyat",
    author: "Elvin Məmmədov",
    views: 2450,
    tags: ["nəqliyyat", "infrastruktur", "paytaxt"],
  },
  {
    title: "Milli komanda beynəlxalq turnirdə finala yüksəldi",
    excerpt: "Yarımfinal qarşılaşmasında qonaqları 3:1 hesabı ilə məğlub edən komandamız finalda güclü rəqiblə qarşılaşacaq.",
    content:
      "Beynəlxalq turnirin yarımfinal mərhələsində meydana çıxan milli komandamız güclü oyun nümayiş etdirərək rəqibini 3:1 hesabı ilə məğlub edib.\n\nBaş məşqçi oyundan sonrakı mətbuat konfransında komandanın göstərdiyi mübarizədən razı qaldığını bildirib.\n\nFinal qarşılaşması bu həftənin sonunda keçiriləcək.",
    categorySlug: "idman",
    author: "Rəşad Hüseynov",
    views: 5310,
    tags: ["futbol", "turnir", "milli komanda"],
  },
  {
    title: "Süni intellekt sahəsində yeni dövlət proqramı təsdiqləndi",
    excerpt: "Proqram çərçivəsində gənc mütəxəssislərin hazırlanması və yerli startaplara dəstək nəzərdə tutulur.",
    content:
      "Rəsmi qurumlar tərəfindən açıqlanan yeni dövlət proqramı süni intellekt sahəsində yerli potensialın gücləndirilməsinə yönəlib.\n\nSənəddə qeyd olunur ki, gələn üç il ərzində yüzlərlə gənc mütəxəssis xüsusi təqaüd proqramları çərçivəsində xaricdə təhsil ala biləcək.\n\nMütəxəssislər bu addımı rəqəmsal iqtisadiyyatın inkişafı baxımından mühüm hesab edir.",
    categorySlug: "texnologiya",
    author: "Nərmin Əliyeva",
    views: 1870,
    tags: ["süni intellekt", "təhsil", "startap"],
  },
  {
    title: "Beynəlxalq təşkilat regional sabitliklə bağlı bəyanat yaydı",
    excerpt: "Bəyanatda tərəflər arasında davam edən danışıqların dialoq yolu ilə davam etdirilməsi vurğulanıb.",
    content:
      "Beynəlxalq təşkilatın nümayəndəliyi regiondakı vəziyyətlə bağlı rəsmi bəyanat yayıb.\n\nSənəddə həmçinin qeyd olunur ki, humanitar yardımların çatdırılması prosesi davam etdirilir.\n\nDiplomatik mənbələr növbəti görüşün yaxın həftələrdə keçiriləcəyini bildirir.",
    categorySlug: "dunya",
    author: "Kamran Səfərov",
    views: 3120,
    tags: ["diplomatiya", "beynəlxalq əlaqələr"],
  },
  {
    title: "Yeni büdcə layihəsi parlamentə təqdim olundu",
    excerpt: "Layihəyə əsasən sosial sahələrə ayrılan vəsaitin həcmi əvvəlki illə müqayisədə artırılıb.",
    content:
      "Hökumət tərəfindən hazırlanan növbəti ilin dövlət büdcəsi layihəsi parlamentə təqdim olunub.\n\nMaliyyə Nazirliyinin nümayəndəsi bildirib ki, büdcə gəlirlərinin əsas hissəsi qeyri-neft sektorunun payının artırılması hesabına formalaşacaq.\n\nDeputatlar layihəni komitələrdə müzakirə etdikdən sonra səsverməyə çıxaracaq.",
    categorySlug: "siyaset",
    author: "Elvin Məmmədov",
    views: 2760,
    tags: ["büdcə", "parlament"],
  },
  {
    title: "Milli filmimiz beynəlxalq kinofestivalda mükafata layiq görüldü",
    excerpt: "Ekspertlər filmin ssenari və rejissorluq işini yüksək qiymətləndirib.",
    content:
      "Yerli istehsal olan uzunmetrajlı bədii film nüfuzlu beynəlxalq kinofestivalda 'Ən yaxşı rejissorluq' nominasiyasında qalib elan olunub.\n\nFilmin rejissoru mükafatı aldıqdan sonra bildirib ki, bu uğur bütün yaradıcı qrupun birgə əməyinin nəticəsidir.\n\nMədəniyyət ictimaiyyəti bu nailiyyəti milli kinematoqrafiya üçün mühüm addım kimi dəyərləndirir.",
    categorySlug: "medeniyyet",
    author: "Aygün Rzayeva",
    views: 1540,
    tags: ["kino", "festival", "mədəniyyət"],
  },
  {
    title: "Yerli bank sektorunda rəqəmsal xidmətlərin payı artır",
    excerpt: "Son hesabata görə, mobil bankçılıqdan istifadə edənlərin sayı ötən illə müqayisədə 40 faiz artıb.",
    content:
      "Mərkəzi Bankın açıqladığı hesabata əsasən, ölkədə rəqəmsal bank xidmətlərindən istifadə sürətlə artmaqda davam edir.\n\nBank nümayəndələri bunun səbəbini istifadəçi təcrübəsinin yaxşılaşdırılması ilə izah edir.\n\nGələcəkdə süni intellekt əsaslı məsləhət xidmətlərinin də tətbiq olunacağı bildirilir.",
    categorySlug: "iqtisadiyyat",
    author: "Nərmin Əliyeva",
    views: 1980,
    tags: ["bank", "rəqəmsallaşma"],
  },
  {
    title: "Yeni nəsil elektrik avtomobilləri üçün infrastruktur genişlənir",
    excerpt: "Şəhər ərazisində 50 yeni enerji doldurma məntəqəsinin quraşdırılması planlaşdırılır.",
    content:
      "Elektrik nəqliyyat vasitələrinin sayının artması fonunda müvafiq infrastrukturun genişləndirilməsi üçün yeni layihəyə start verilib.\n\nRəsmilər bildirir ki, bu addım ekoloji vəziyyətin yaxşılaşdırılmasına xidmət edəcək.\n\nİlk məntəqələrin payız aylarında istifadəyə veriləcəyi gözlənilir.",
    categorySlug: "texnologiya",
    author: "Rəşad Hüseynov",
    views: 1320,
    tags: ["elektrik avtomobil", "infrastruktur"],
  },
];

async function seed() {
  console.log("Kateqoriyalar əlavə olunur...");
  for (const c of CATEGORIES) {
    await db.insert(categories).values(c).onConflictDoNothing();
  }

  console.log("Xəbərlər əlavə olunur...");
  for (const a of ARTICLES) {
    await db.insert(articles).values(a);
  }

  console.log("Seed tamamlandı ✅");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed xətası:", err);
  process.exit(1);
});
