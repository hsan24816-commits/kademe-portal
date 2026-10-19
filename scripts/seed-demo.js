'use strict';
// Fills an empty database with a demo organisation (1 deputy GM, 3 directors, 6 managers)
// so the portal can be tried out. Usage: npm run seed:demo [-- --reset]
// --reset wipes ALL data first. Every demo account uses DEMO_PASSWORD (default demo1234).
const { createPool, migrate, tx } = require('../src/db');
const auth = require('../src/auth');

const COLORS = ['#1d4f86', '#0f7a8a', '#7c3aed', '#b45309', '#be185d', '#047857', '#4338ca', '#9a6700', '#0e7490', '#b91c1c'];

async function seedDemo(pool, { reset = false, password = process.env.DEMO_PASSWORD || 'demo1234' } = {}) {
  await migrate(pool);
  const { rows } = await pool.query('SELECT count(*)::int AS n FROM users');
  if (rows[0].n > 0 && !reset) throw new Error('Database already has users. Run with --reset to wipe it and load the demo data.');
  const hash = auth.hashPassword(password);
  const T = new Date(); T.setHours(0, 0, 0, 0);
  const at = (d, h = 9, m = 0) => { const x = new Date(T); x.setDate(x.getDate() + d); x.setHours(h, m, 0, 0); return x.toISOString(); };
  const day = (d) => { const x = new Date(T); x.setDate(x.getDate() + d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };

  await tx(pool, async (c) => {
    if (reset) {
      await c.query(`TRUNCATE notifications, scores, announcement_acks, announcements, meeting_attendees, meetings,
        project_comments, project_reports, projects, sessions, users CASCADE`);
    }
    const U = {};
    const people = [
      ['halit', 'Halit Özdamar', 'Genel Müdür Yardımcısı', 'gmy', null, 'Genel Müdürlük'],
      ['ayse', 'Ayşe Kaya', 'Bilgi Teknolojileri Direktörü', 'director', 'halit', 'Bilgi Teknolojileri'],
      ['murat', 'Murat Demir', 'Operasyon Direktörü', 'director', 'halit', 'Operasyon'],
      ['elif', 'Elif Şahin', 'Finans Direktörü', 'director', 'halit', 'Finans'],
      ['emre', 'Emre Yıldız', 'Yazılım Geliştirme Müdürü', 'manager', 'ayse', 'Bilgi Teknolojileri'],
      ['zeynep', 'Zeynep Arslan', 'Veri Analitiği Müdürü', 'manager', 'ayse', 'Bilgi Teknolojileri'],
      ['can', 'Can Öztürk', 'Lojistik Müdürü', 'manager', 'murat', 'Operasyon'],
      ['selin', 'Selin Aydın', 'Kalite Yönetimi Müdürü', 'manager', 'murat', 'Operasyon'],
      ['burak', 'Burak Koç', 'Bütçe ve Raporlama Müdürü', 'manager', 'elif', 'Finans'],
      ['deniz', 'Deniz Çelik', 'Satın Alma Müdürü', 'manager', 'elif', 'Finans'],
      ['ali', 'Ali Vural', 'Veri Analisti', 'employee', 'zeynep', 'Bilgi Teknolojileri'],
      ['ece', 'Ece Tan', 'Veri Mühendisi', 'employee', 'zeynep', 'Bilgi Teknolojileri'],
    ];
    for (const [i, [un, name, title, role, boss, dept]] of people.entries()) {
      const r = await c.query(
        `INSERT INTO users (username, email, name, title, role, manager_id, dept, color, password_hash, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, now() - make_interval(secs => $10)) RETURNING id`,
        [un, `${un}@kademe.example`, name, title, role, boss ? U[boss] : null, dept, COLORS[i % COLORS.length], hash, 1000 - i]
      );
      U[un] = r.rows[0].id;
    }

    const P = {};
    const projects = [
      ['p1', 'Mobil uygulama yenileme', 'Saha ekiplerinin kullandığı mobil uygulamanın arayüz ve altyapı yenilemesi.', 'emre', 'ayse', -60, 40, [[-21, 40, 'iyi', 'Tasarım sistemi tamamlandı, ilk ekranlar geliştirmede.'], [-14, 50, 'iyi', 'Giriş ve görev ekranları test ortamında.'], [-6, 58, 'iyi', 'Çevrim dışı çalışma modu eklendi.'], [-2, 64, 'iyi', 'Pilot kullanıcı grubu belirlendi, beta dağıtımı hazırlanıyor.']]],
      ['p2', 'Kimlik doğrulama altyapısı (SSO)', 'Tüm iç uygulamaların tek oturum açma altyapısına taşınması.', 'emre', 'ayse', -90, 12, [[-20, 70, 'iyi', 'İK ve satış uygulamaları bağlandı.'], [-9, 80, 'iyi', 'Yardım masası uygulaması bağlandı.'], [-1, 88, 'iyi', 'Tüm iç uygulamalar SSO ile bağlandı; muhasebe modülü kaldı.']]],
      ['p3', 'Yönetim paneli (BI) kurulumu', 'Direktörlerin haftalık KPI takibi için ortak raporlama paneli.', 'zeynep', 'ayse', -45, 25, [[-18, 25, 'iyi', 'Gösterge tanımları direktörlerle netleştirildi.'], [-10, 38, 'risk', 'Kaynak sistemlerden veri erişim izinleri gecikiyor.'], [-3, 45, 'risk', 'İzinlerin yarısı geldi; satış verisi hâlâ bekleniyor.']]],
      ['p4', 'Veri ambarı göçü', 'Eski veri ambarının bulut platformuna taşınması.', 'zeynep', 'ayse', -120, -10, [[-30, 80, 'iyi', 'Finans ve operasyon tabloları taşındı.'], [-15, 95, 'iyi', 'Paralel çalıştırma testleri bitti.'], [-11, 100, 'iyi', 'Göç tamamlandı, eski sunucular kapatıldı.']], 'done'],
      ['p5', 'Siber güvenlik denetimi hazırlığı', 'Yıllık dış denetim öncesi kontrollerin ve dokümantasyonun tamamlanması.', 'ayse', 'halit', -40, -3, [[-25, 10, 'iyi', 'Kontrol listesi çıkarıldı.'], [-12, 22, 'risk', 'Sızma testi firmasıyla sözleşme gecikti.'], [-4, 30, 'gecikme', 'Dış denetim takvimi kaydı; sızma testi raporu bekleniyor.']]],
      ['p6', 'Depo otomasyonu', 'Ana depoda barkodlu giriş-çıkış ve WMS entegrasyonu.', 'can', 'murat', -70, 60, [[-28, 30, 'iyi', 'Raf etiketleme bitti.'], [-14, 42, 'iyi', 'El terminalleri teslim alındı.'], [-5, 52, 'iyi', 'Barkod okuyucular kuruldu; WMS entegrasyonu sürüyor.']]],
      ['p7', 'Rota optimizasyonu', 'Dağıtım araçları için günlük rota planlama aracının devreye alınması.', 'can', 'murat', -50, 30, [[-24, 12, 'iyi', 'Pilot bölge seçildi.'], [-10, 20, 'risk', 'Araç takip verisi eksik geliyor; tedarikçi ile görüşülüyor.']]],
      ['p8', 'ISO 9001 yeniden belgelendirme', 'Kalite yönetim sistemi belgesinin yenilenmesi.', 'selin', 'murat', -80, 35, [[-20, 55, 'iyi', 'Süreç dokümanları güncellendi.'], [-12, 66, 'iyi', 'İç tetkik planı onaylandı.'], [-4, 75, 'iyi', 'İç tetkikler tamamlandı; düzeltici faaliyetler kapanıyor.']]],
      ['p9', 'Tedarik zinciri dijitalleşme', 'Sipariş, sevkiyat ve stok süreçlerinin tek platformda izlenmesi.', 'murat', 'halit', -30, 90, [[-21, 15, 'iyi', 'İhtiyaç analizi tamamlandı.'], [-7, 30, 'iyi', 'Platform seçimi yapıldı.'], [-2, 38, 'iyi', 'Kurulum takvimi tedarikçiyle netleşti.']]],
      ['p10', '2027 bütçe planlaması', 'Departman bütçe taleplerinin toplanması ve konsolidasyonu.', 'burak', 'elif', -35, 42, [[-16, 30, 'iyi', 'Bütçe şablonu dağıtıldı.'], [-8, 45, 'iyi', 'Operasyon ve BT talepleri geldi.'], [-1, 58, 'iyi', 'Departman taleplerinin yüzde 80\'i toplandı.']]],
      ['p11', 'Tedarikçi portalı', 'Tedarikçilerin teklif ve faturalarını yükleyebileceği web portalı.', 'deniz', 'elif', -55, -5, [[-30, 5, 'iyi', 'Gereksinimler yazıldı.'], [-12, 15, 'gecikme', 'Yazılım firmasının teslimi iki hafta kaydı.']]],
      ['p12', 'Satın alma süreç iyileştirme', 'Onay adımlarının azaltılması ve sürenin kısaltılması.', 'deniz', 'elif', -100, -20, [[-40, 60, 'iyi', 'Yeni onay matrisi taslağı hazır.'], [-25, 100, 'iyi', 'Yeni süreç yürürlüğe girdi.']], 'done'],
      ['p13', 'Maliyet azaltma programı', 'Genel giderlerde yüzde 8 tasarruf hedefi.', 'elif', 'halit', -60, 70, [[-20, 30, 'iyi', 'Tasarruf kalemleri belirlendi.'], [-9, 40, 'risk', 'Kira görüşmeleri uzuyor.'], [-3, 47, 'risk', 'Enerji giderlerinde hedefin gerisindeyiz.']]],
      ['p15', 'Satış verisi kalite kontrolü', 'BI paneline gelecek satış verisinde eksik ve hatalı kayıtların temizlenmesi.', 'ali', 'zeynep', -12, 20, [[-7, 20, 'iyi', 'Kontrol kuralları yazıldı.'], [-2, 35, 'iyi', 'İlk temizlik raporu Zeynep Hanım ile paylaşıldı.']]],
      ['p16', 'Veri akışı otomasyonu', 'Kaynak sistemlerden günlük veri yüklemesinin otomatikleştirilmesi.', 'ece', 'zeynep', -20, 30, [[-10, 25, 'iyi', 'Zamanlayıcı kuruldu.'], [-3, 40, 'risk', 'Satış sisteminden erişim izni bekleniyor.']]],
      ['p14', 'Kurumsal strateji 2027', '2027 stratejik önceliklerinin ve hedef kartlarının hazırlanması.', 'halit', 'halit', -25, 55, [[-14, 20, 'iyi', 'Çalıştay takvimi belirlendi.'], [-4, 35, 'iyi', 'Direktörlerden stratejik öncelik girdileri alındı.']]],
    ];
    for (const [key, name, desc, owner, by, start, due, reps, status = 'active'] of projects) {
      const last = reps[reps.length - 1];
      const r = await c.query(
        `INSERT INTO projects (name, description, owner_id, created_by, created_at, start_date, due_date, status, progress, health)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
        [name, desc, U[owner], U[by], at(start), day(start), day(due), status, last[1], last[2]]
      );
      P[key] = r.rows[0].id;
      for (const [d, prog, h, note] of reps) {
        await c.query('INSERT INTO project_reports (project_id, author_id, created_at, progress, health, note) VALUES ($1,$2,$3,$4,$5,$6)',
          [P[key], U[owner], at(d, 16, 30), prog, h, note]);
      }
    }
    const comments = [
      ['p3', 'halit', -2, 10, 'Satış verisi için Elif Hanım ile konuşalım, bu hafta çözelim.'],
      ['p3', 'zeynep', -2, 11, 'Teşekkürler, Perşembe toplantısına ekledim.'],
      ['p5', 'halit', -3, 9, 'Denetim tarihini kaçırmayalım, haftalık durum bekliyorum.'],
      ['p7', 'murat', -6, 14, 'Can Bey, güncel rapor bekliyorum.'],
    ];
    for (const [p, by, d, h, text] of comments) {
      await c.query('INSERT INTO project_comments (project_id, author_id, created_at, body) VALUES ($1,$2,$3,$4)', [P[p], U[by], at(d, h), text]);
    }

    const everyone = people.map((p) => p[0]).filter((x) => x !== 'halit');
    const meetings = [
      [0, 10, 0, 60, 'Haftalık direktörler toplantısı', 'halit', ['ayse', 'murat', 'elif'], 'yuz', 'Genel Müdürlük toplantı salonu', '1) Proje durumları\n2) Bütçe takvimi\n3) Riskler', ['ayse', 'murat', 'elif']],
      [0, 15, 30, 45, 'BT ekip senkronu', 'ayse', ['emre', 'zeynep'], 'online', 'Teams', 'Sprint durumu ve engeller', ['emre', 'zeynep']],
      [1, 9, 30, 60, '2027 bütçe ön değerlendirme', 'halit', ['elif', 'burak'], 'yuz', 'Toplantı odası 3', 'Departman taleplerinin ilk değerlendirmesi', ['elif']],
      [1, 13, 30, 30, 'Rota optimizasyonu birebir', 'murat', ['can'], 'online', 'Teams', 'Veri eksikliği ve yeni takvim', []],
      [2, 14, 0, 90, 'Operasyon KPI gözden geçirme', 'murat', ['can', 'selin', 'halit'], 'yuz', 'Operasyon binası, kat 2', 'Depo, lojistik ve kalite göstergeleri', ['can', 'selin']],
      [3, 11, 0, 45, 'Siber güvenlik denetimi durum', 'halit', ['ayse', 'emre'], 'yuz', 'Genel Müdürlük toplantı salonu', 'Denetim takvimi ve açık bulgular', ['ayse']],
      [3, 15, 0, 30, 'BI paneli veri erişimi', 'zeynep', ['ayse'], 'online', 'Teams', 'Satış verisi izin süreci', ['ayse']],
      [4, 16, 0, 60, 'Aylık genel değerlendirme', 'halit', everyone, 'yuz', 'Konferans salonu', 'Her müdür 3 dakikalık özet sunar.', ['ayse', 'murat', 'elif', 'emre', 'selin']],
      [-3, 14, 0, 60, 'Tedarikçi portalı gecikme toplantısı', 'elif', ['deniz'], 'yuz', 'Finans toplantı odası', 'Yeni teslim planı', ['deniz']],
      [7, 10, 0, 60, 'Haftalık direktörler toplantısı', 'halit', ['ayse', 'murat', 'elif'], 'yuz', 'Genel Müdürlük toplantı salonu', 'Proje durumları', []],
    ];
    for (const [d, h, m, dur, title, org, att, mode, loc, agenda, yes] of meetings) {
      const r = await c.query(
        `INSERT INTO meetings (title, starts_at, duration_min, mode, location, agenda, organizer_id, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
        [title, at(d, h, m), dur, mode, loc, agenda, U[org], at(Math.min(d, 0) - 2, 10)]
      );
      for (const a of att) {
        await c.query('INSERT INTO meeting_attendees (meeting_id, user_id, rsvp) VALUES ($1,$2,$3)', [r.rows[0].id, U[a], yes.includes(a) ? 'yes' : null]);
      }
    }

    const anns = [
      ['halit', null, 'kural', -7, 'İlerleme raporları her Cuma 17:00\'ye kadar girilmeli', 'Tüm proje sahipleri haftalık ilerleme yüzdesini ve kısa açıklamayı Cuma 17:00\'ye kadar Projeler sekmesinden girmelidir. Gecikmeli projelerde engel ve ihtiyaç mutlaka yazılmalıdır.', true, ['ayse', 'murat', 'emre', 'zeynep', 'selin', 'burak']],
      ['halit', null, 'duyuru', -1, 'Aylık genel değerlendirme Cuma 16:00\'da', 'Konferans salonunda tüm direktör ve müdürlerin katılımıyla yapılacak. Her müdür 3 dakikalık özet sunumu hazırlasın.', false, ['ayse', 'elif']],
      ['ayse', 'ayse', 'hatirlatma', -2, 'Sprint demo hazırlığı', 'Perşembe günkü demo için ekran kayıtlarını Çarşamba akşamına kadar paylaşalım.', false, ['emre']],
      ['murat', 'murat', 'kural', -10, 'Saha ziyaretlerinde İSG kontrol listesi zorunlu', 'Depo ve saha ziyaretlerinden önce iş sağlığı ve güvenliği kontrol listesi doldurulmalıdır.', false, ['can', 'selin']],
      ['elif', 'elif', 'hatirlatma', -4, 'Q4 bütçe revizyonları için son tarih 31 Ekim', 'Revizyon talepleri gerekçeleriyle birlikte Burak Bey\'e iletilmelidir.', true, ['burak']],
      ['halit', null, 'kural', -20, 'Toplantı davetlerine 24 saat içinde yanıt verin', 'Katılım durumu bilinmeyen toplantılar planlamayı zorlaştırıyor. Davetlere Ana sayfa > Toplantılar üzerinden yanıt verebilirsiniz.', false, everyone],
    ];
    for (const [by, lead, kind, d, title, body, pinned, acks] of anns) {
      const r = await c.query(
        `INSERT INTO announcements (author_id, audience_lead_id, kind, title, body, pinned, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [U[by], lead ? U[lead] : null, kind, title, body, pinned, at(d, 9, 30)]
      );
      for (const a of acks) await c.query('INSERT INTO announcement_acks (announcement_id, user_id) VALUES ($1,$2)', [r.rows[0].id, U[a]]);
    }

    // A few game results so the leaderboard is not empty
    let s = 20261019;
    const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    const skill = { halit: .62, ayse: .7, murat: .5, elif: .58, emre: .74, zeynep: .8, can: .45, selin: .6, burak: .55, deniz: .5, ali: .66, ece: .57 };
    for (const un of Object.keys(U)) {
      const n = 3 + Math.floor(rnd() * 8);
      for (let i = 0; i < n; i++) {
        const when = new Date(Date.now() - rnd() * 20 * 86400e3);
        const score = Math.max(0, Math.min(100, Math.round(skill[un] * 100 + (rnd() - 0.5) * 50)));
        await c.query('INSERT INTO scores (user_id, game, score, created_at) VALUES ($1,$2,$3,$4)', [U[un], ['xox', 'hangman', 'memory'][i % 3], score, when.toISOString()]);
      }
    }

    // Starter notifications
    const note = (to, kind, text, link, d) => c.query('INSERT INTO notifications (user_id, kind, text, link, created_at, read) VALUES ($1,$2,$3,$4,$5,$6)',
      [U[to], kind, text, JSON.stringify(link), at(d, 11), d < -2]);
    await note('halit', 'report', 'Emre Yıldız “Mobil uygulama yenileme” için ilerleme raporu girdi: %64', { view: 'project', id: P.p1 }, -2);
    await note('halit', 'report', 'Zeynep Arslan “Yönetim paneli (BI) kurulumu” için ilerleme raporu girdi: %45', { view: 'project', id: P.p3 }, -3);
    await note('halit', 'report', 'Burak Koç “2027 bütçe planlaması” için ilerleme raporu girdi: %58', { view: 'project', id: P.p10 }, -1);
    await note('halit', 'meeting', 'Murat Demir sizi “Operasyon KPI gözden geçirme” toplantısına davet etti', { view: 'meetings' }, -1);
    for (const un of everyone) await note(un, 'lobby', 'Halit Özdamar Lobi\'de yeni bir duyuru yayınladı: “Aylık genel değerlendirme Cuma 16:00\'da”', { view: 'lobby' }, -1);
  });
  return { password };
}

module.exports = { seedDemo };

if (require.main === module) {
  (async () => {
    const pool = createPool();
    const { password } = await seedDemo(pool, { reset: process.argv.includes('--reset') });
    console.log(`Demo data loaded. Sign in as halit, ayse, murat, elif, emre, zeynep, can, selin, burak or deniz with password: ${password}`);
    await pool.end();
  })().catch((e) => { console.error(e.message); process.exit(1); });
}
