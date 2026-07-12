export default function AboutPage() {
  return (
    <>
      <h1 className="section-title">Haqqımızda</h1>
      <div style={{ maxWidth: 720 }}>
        <p>
          AKTUAL — obyektiv, sürətli və dəqiq xəbər xidməti göstərmək məqsədilə yaradılmış müstəqil onlayn nəşrdir.
          Komandamız siyasət, iqtisadiyyat, idman, mədəniyyət, texnologiya və dünya xəbərlərini oxuculara operativ
          şəkildə çatdırır.
        </p>
        <p>
          Sayt Next.js üzərində qurulub, məlumatlar Neon (serverless PostgreSQL) verilənlər bazasında saxlanılır və
          Vercel üzərində yerləşdirilir.
        </p>
        <h3 style={{ fontFamily: "var(--font-display)" }}>Missiyamız</h3>
        <p>Doğru məlumatı, mənbəyə əsaslanaraq, vaxtında və heç bir təhrifə yol vermədən oxucuya çatdırmaq.</p>
        <h3 style={{ fontFamily: "var(--font-display)" }}>Redaksiya prinsipləri</h3>
        <ul>
          <li>Faktlara əsaslanan, yoxlanılmış məlumat</li>
          <li>Mənbələrin şəffaflığı</li>
          <li>Tərəflərin bərabər təmsili</li>
        </ul>
      </div>
    </>
  );
}
