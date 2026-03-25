// Lesson content for each topic - Khan Academy style
export interface LessonStep {
  type: 'intro' | 'animation' | 'example' | 'practice' | 'summary'
  titleAl: string
  contentAl: string
  mascotMessage?: string
  animationType?: 'addition' | 'subtraction' | 'multiplication' | 'division'
  animationNumbers?: [number, number]
  tipAl?: string
}

export interface Lesson {
  topicId: string
  titleAl: string
  introAl: string
  steps: LessonStep[]
}

export const lessons: Lesson[] = [
  {
    topicId: 'mbledhja',
    titleAl: 'Mësojmë Mbledhjen',
    introAl: 'Mbledhja është kur bashkojmë dy ose më shumë grupe së bashku!',
    steps: [
      {
        type: 'intro',
        titleAl: 'Çfarë është Mbledhja?',
        contentAl: 'Mbledhja do të thotë të bashkosh gjëra së bashku. Kur ke 3 mollë dhe merr edhe 2 mollë të tjera, ti i mblidh ato për të gjetur sa mollë ke gjithsej!',
        mascotMessage: 'Përshëndetje! Sot do të mësojmë diçka shumë të bukur - mbledhjen! 🎉',
      },
      {
        type: 'example',
        titleAl: 'Kuptimi i Mbledhjes',
        contentAl: `
          🍎 **Shembull me mollë:**
          Noari ka 5 mollë në një dorë dhe 3 mollë në dorën tjetër.
          Sa mollë ka gjithsej?
          
          5 + 3 = 8 mollë!
          
          🔢 **Simboli + quhet "plus" ose "dhe"**
          Kur shohim + , do të thotë "bashko së bashku"
        `,
        mascotMessage: 'Mbledhja është si të vendosësh gjëra në një shportë të madhe!',
        tipAl: 'Fjalët "gjithsej", "bashkë", "total" zakonisht tregojnë mbledhje!',
      },
      {
        type: 'animation',
        titleAl: 'Shiko si funksionon!',
        contentAl: 'Le të shohim çfarë ndodh kur mbledhim 3 + 4:',
        animationType: 'addition',
        animationNumbers: [3, 4],
        mascotMessage: 'Shiko si bashkohen grupet! Numëro gjithsej!',
      },
      {
        type: 'example',
        titleAl: 'Truket e Mbledhjes',
        contentAl: `
          🔢 **Truku 1: Fillo nga numri më i madh**
          Në vend të 3 + 8, mendo 8 + 3 - është më e lehtë!
          
          🔢 **Truku 2: Bëj dhjetësha**
          8 + 5 = 8 + 2 + 3 = 10 + 3 = 13
          
          🔢 **Truku 3: Numëro me gishta**
          Për numra të vegjël, gishtat janë miqtë e tu!
          
          🔢 **Truku 4: Mendo numrat fqinj**
          7 + 8 = 7 + 7 + 1 = 14 + 1 = 15
        `,
        mascotMessage: 'Këto truke do të të ndihmojnë të llogaritësh shpejt!',
        tipAl: 'Kur mblidh dy numra, rendi nuk ka rëndësi: 3+5 = 5+3',
      },
      {
        type: 'animation',
        titleAl: 'Një shembull tjetër',
        contentAl: 'Le të provojmë me numra më të mëdhenj: 5 + 6',
        animationType: 'addition',
        animationNumbers: [5, 6],
        mascotMessage: 'Numëro bashkë me mua!',
      },
      {
        type: 'example',
        titleAl: 'Mbledhja me Mbajtje (me Kalim)',
        contentAl: `
          🔢 **Kur njëshat kalojnë 10:**
          
          Shembull: 27 + 15 = ?
          
          1️⃣ Mblidh njëshat: 7 + 5 = 12
          2️⃣ Shkruaj 2, mbart 1 te dhjetëshat
          3️⃣ Mblidh dhjetëshat: 2 + 1 + 1 = 4
          4️⃣ Përgjigja: 42
          
             27
           + 15
           ────
             42
        `,
        mascotMessage: 'Kur njëshat bëhen më shumë se 9, kalojmë një dhjetëshe!',
        tipAl: 'Mbart = kalon te pozicioni tjetër',
      },
      {
        type: 'summary',
        titleAl: 'Çfarë mësuam',
        contentAl: `
          ✅ Mbledhja bashkon grupe së bashku
          ✅ Përdor simbolin + (plus)
          ✅ Rendi i numrave nuk ndryshon rezultatin
          ✅ Kur njëshat kalojnë 9, mbartim te dhjetëshat
          ✅ Praktiko çdo ditë dhe do të bëhesh mjeshtër!
        `,
        mascotMessage: 'Je gati për kuizin? Besoj në ty! 💪',
      },
    ],
  },
  {
    topicId: 'zbritja',
    titleAl: 'Mësojmë Zbritjen',
    introAl: 'Zbritja është kur heqim diçka nga një grup!',
    steps: [
      {
        type: 'intro',
        titleAl: 'Çfarë është Zbritja?',
        contentAl: 'Zbritja do të thotë të heqësh diçka nga ajo që ke. Nëse ke 7 bonbone dhe ha 3, sa të mbeten? Kjo është zbritje: 7 - 3 = 4 bonbone mbeten!',
        mascotMessage: 'Sot mësojmë zbritjen! Është e kundërta e mbledhjes. 🍬',
      },
      {
        type: 'example',
        titleAl: 'Kuptimi i Zbritjes',
        contentAl: `
          🎈 **Shembull me balona:**
          Noari kishte 9 balona. 4 balona plasën.
          Sa balona i mbetën?
          
          9 - 4 = 5 balona!
          
          🔢 **Simboli - quhet "minus" ose "hiq"**
          Kur shohim - , do të thotë "hiq" ose "largo"
        `,
        mascotMessage: 'Zbritja tregon sa mbetet pasi heqim diçka!',
        tipAl: 'Fjalët "mbetën", "largoi", "hëngri", "dha" zakonisht tregojnë zbritje!',
      },
      {
        type: 'animation',
        titleAl: 'Shiko si funksionon!',
        contentAl: 'Le të shohim çfarë ndodh kur zbresim 7 - 3:',
        animationType: 'subtraction',
        animationNumbers: [7, 3],
        mascotMessage: 'Shiko si largohen disa objekte!',
      },
      {
        type: 'example',
        titleAl: 'Truket e Zbritjes',
        contentAl: `
          🔢 **Truku 1: Numëro mbrapsht**
          Për 9 - 3, fillo nga 9 dhe numëro mbrapsht: 8, 7, 6!
          
          🔢 **Truku 2: Mendo mbledhjen**
          8 - 5 = ? Mendo: 5 + çfarë = 8? Përgjigja: 3!
          
          🔢 **Truku 3: Zbrit dhjetësha të plota**
          45 - 20 = 25 (zbrit vetëm dhjetëshat!)
          
          🔢 **Truku 4: Zbrit në dy hapa**
          15 - 8 = 15 - 5 - 3 = 10 - 3 = 7
        `,
        mascotMessage: 'Zbritja dhe mbledhja janë si motra binjake!',
        tipAl: 'Kontrollo punën: nëse 10-4=6, atëherë 6+4 duhet të bëjë 10!',
      },
      {
        type: 'animation',
        titleAl: 'Një shembull tjetër',
        contentAl: 'Le të provojmë: 10 - 4',
        animationType: 'subtraction',
        animationNumbers: [10, 4],
        mascotMessage: 'Sa mbeten pas heqjes?',
      },
      {
        type: 'example',
        titleAl: 'Zbritja me Huazim',
        contentAl: `
          🔢 **Kur njëshat nuk mjaftojnë:**
          
          Shembull: 42 - 17 = ?
          
          1️⃣ Njëshat: 2 - 7? Nuk mundemi!
          2️⃣ Huazojmë 1 dhjetëshe (bëhet 10 njësha)
          3️⃣ Tani: 12 - 7 = 5
          4️⃣ Dhjetëshat: 3 - 1 = 2 (sepse huazuam 1)
          5️⃣ Përgjigja: 25
          
             42
           - 17
           ────
             25
        `,
        mascotMessage: 'Kur nuk ke mjaft njësha, huazo nga dhjetëshat!',
        tipAl: 'Huazimi = merr 10 nga dhjetëshat',
      },
      {
        type: 'summary',
        titleAl: 'Çfarë mësuam',
        contentAl: `
          ✅ Zbritja heq nga një grup
          ✅ Përdor simbolin - (minus)
          ✅ Rezultati është gjithmonë më i vogël ose i barabartë
          ✅ Kur njëshat nuk mjaftojnë, huazojmë nga dhjetëshat
          ✅ Kontrollo me mbledhje: a - b = c, atëherë c + b = a
        `,
        mascotMessage: 'Tani je gati për kuizin e zbritjes! 🌟',
      },
    ],
  },
  {
    topicId: 'shumezimi',
    titleAl: 'Mësojmë Shumëzimin',
    introAl: 'Shumëzimi është mbledhje e shpejtë e grupeve të njëjta!',
    steps: [
      {
        type: 'intro',
        titleAl: 'Çfarë është Shumëzimi?',
        contentAl: 'Shumëzimi është kur ke shumë grupe me të njëjtin numër. Në vend që të mbledhësh 4+4+4, thua 3×4! Është si një shkurtore magike!',
        mascotMessage: 'Shumëzimi është si një shkurtore magike! ✨',
      },
      {
        type: 'example',
        titleAl: 'Kuptimi i Shumëzimit',
        contentAl: `
          🍪 **Shembull me biskota:**
          Noari ka 4 pjata. Çdo pjatë ka 5 biskota.
          Sa biskota ka gjithsej?
          
          4 × 5 = 20 biskota!
          
          Kjo është njësoj si: 5 + 5 + 5 + 5 = 20
          
          🔢 **Simboli × quhet "herë" ose "shumëzuar me"**
        `,
        mascotMessage: 'Shumëzimi është mbledhje e shpejtë!',
        tipAl: '3 × 4 do të thotë: 4 + 4 + 4 (tri katërsha)',
      },
      {
        type: 'animation',
        titleAl: 'Shiko grupet!',
        contentAl: 'Le të shohim 3 × 4 (3 grupe me nga 4):',
        animationType: 'multiplication',
        animationNumbers: [3, 4],
        mascotMessage: 'Numëro yjet në çdo grup!',
      },
      {
        type: 'example',
        titleAl: 'Tabela e Shumëzimit',
        contentAl: `
          📊 **Tabelat më të rëndësishme:**
          
          **Tabela e 2:** 2,4,6,8,10,12,14,16,18,20
          (Gjithmonë numra çift!)
          
          **Tabela e 5:** 5,10,15,20,25,30,35,40,45,50
          (Mbarojnë me 0 ose 5!)
          
          **Tabela e 10:** 10,20,30,40,50,60,70,80,90,100
          (Shto 0 në fund!)
          
          **Tabela e 9:** Gishtat magji!
          9×3: Ul gishtin 3, lexo: 27 ✨
        `,
        mascotMessage: 'Mëso tabelën e shumëzimit përmendësh!',
        tipAl: 'Praktiko tabelën çdo ditë për 5 minuta!',
      },
      {
        type: 'example',
        titleAl: 'Truket e Shumëzimit',
        contentAl: `
          🔢 **Truku 1: Rendi nuk ka rëndësi**
          3 × 4 = 4 × 3 = 12
          
          🔢 **Truku 2: Shumëzimi me 1**
          Çdo numër × 1 = ai vetë: 7 × 1 = 7
          
          🔢 **Truku 3: Shumëzimi me 0**
          Çdo numër × 0 = 0: 7 × 0 = 0
          
          🔢 **Truku 4: Ndaj dhe shumëzo**
          12 × 5 = 10×5 + 2×5 = 50 + 10 = 60
        `,
        mascotMessage: 'Këto truke do të të ndihmojnë shumë!',
      },
      {
        type: 'animation',
        titleAl: 'Edhe një shembull',
        contentAl: 'Le të provojmë 4 × 5:',
        animationType: 'multiplication',
        animationNumbers: [4, 5],
        mascotMessage: 'Sa yje ke gjithsej?',
      },
      {
        type: 'summary',
        titleAl: 'Çfarë mësuam',
        contentAl: `
          ✅ Shumëzimi = grupe të njëjta të mbledhura
          ✅ Përdor simbolin × (herë)
          ✅ Mëso tabelën e shumëzimit!
          ✅ 3×4 = 4+4+4 = 12
          ✅ Rendi nuk ka rëndësi: 3×4 = 4×3
        `,
        mascotMessage: 'Ti je gati të bëhesh mjeshtër i shumëzimit! 🏆',
      },
    ],
  },
  {
    topicId: 'pjestimi',
    titleAl: 'Mësojmë Pjesëtimin',
    introAl: 'Pjesëtimi është kur ndajmë në grupe të barabarta!',
    steps: [
      {
        type: 'intro',
        titleAl: 'Çfarë është Pjesëtimi?',
        contentAl: 'Pjesëtimi do të thotë të ndash në pjesë të barabarta. Nëse ke 12 bonbone për 3 miq, sa merr secili? Kjo është pjesëtim: 12 ÷ 3 = 4 bonbone secili!',
        mascotMessage: 'Pjesëtimi na ndihmon të ndajmë drejt! 🤝',
      },
      {
        type: 'example',
        titleAl: 'Kuptimi i Pjesëtimit',
        contentAl: `
          🍕 **Shembull me pica:**
          Kemi 8 feta pice për 4 fëmijë.
          Sa feta merr çdo fëmijë?
          
          8 ÷ 4 = 2 feta secili!
          
          🔢 **Simboli ÷ quhet "pjesëtuar me" ose "ndarë me"**
          Pjesëtimi ndihmon të ndajmë në mënyrë të barabartë
        `,
        mascotMessage: 'Pjesëtimi na mëson të ndajmë drejt me të gjithë!',
        tipAl: 'Pjesëtimi është e kundërta e shumëzimit!',
      },
      {
        type: 'animation',
        titleAl: 'Shiko si ndajmë!',
        contentAl: 'Le të ndajmë 12 bonbone në 3 qese:',
        animationType: 'division',
        animationNumbers: [12, 3],
        mascotMessage: 'Shiko si shpërndahen në mënyrë të barabartë!',
      },
      {
        type: 'example',
        titleAl: 'Lidhja me Shumëzimin',
        contentAl: `
          🔗 **Pjesëtimi dhe Shumëzimi janë vëllezër:**
          
          Nëse di që 4 × 3 = 12, atëherë:
          12 ÷ 3 = 4 ✓
          12 ÷ 4 = 3 ✓
          
          **Mendo kështu:**
          20 ÷ 5 = ? 
          Pyet veten: 5 × çfarë = 20?
          5 × 4 = 20, pra përgjigja është 4!
        `,
        mascotMessage: 'Nëse di shumëzimin, di edhe pjesëtimin!',
        tipAl: 'Kontrollo: nëse 15÷3=5, atëherë 5×3=15!',
      },
      {
        type: 'example',
        titleAl: 'Truket e Pjesëtimit',
        contentAl: `
          🔢 **Truku 1: Mendo shumëzimin**
          12 ÷ 3 = ? Mendo: 3 × ? = 12. Përgjigja: 4!
          
          🔢 **Truku 2: Pjesëtimi me 2**
          Gjysmo numrin: 10 ÷ 2 = 5
          
          🔢 **Truku 3: Pjesëtimi me vetveten**
          Çdo numër ÷ vetveten = 1: 7 ÷ 7 = 1
          
          🔢 **Truku 4: Pjesëtimi me 1**
          Çdo numër ÷ 1 = ai vetë: 7 ÷ 1 = 7
        `,
        mascotMessage: 'Pjesëtimi bëhet i lehtë kur di truket!',
      },
      {
        type: 'animation',
        titleAl: 'Edhe një shembull',
        contentAl: 'Le të provojmë 15 ÷ 5:',
        animationType: 'division',
        animationNumbers: [15, 5],
        mascotMessage: 'Sa në çdo grup?',
      },
      {
        type: 'summary',
        titleAl: 'Çfarë mësuam',
        contentAl: `
          ✅ Pjesëtimi = ndarje e barabartë
          ✅ Përdor simbolin ÷ (pjesëtuar)
          ✅ Është e kundërta e shumëzimit
          ✅ Kontrollo me shumëzim!
          ✅ Nëse a ÷ b = c, atëherë c × b = a
        `,
        mascotMessage: 'Urime! Tani di të katër veprimet! 🎓',
      },
    ],
  },
]

// ─── Shumëzimi Dyshifror/Treshifror ─────────────────────────────────
lessons.push({
  topicId: 'shumezimi_dyshifror',
  titleAl: 'Shumëzimi i Numrave Dyshifrorë',
  introAl: 'Tani mësojmë si të shumëzojmë numra me dy ose tre shifra!',
  steps: [
    {
      type: 'intro',
      titleAl: 'Çfarë do të mësojmë?',
      contentAl: 'Kemi mësuar tabelën e shumëzimit (3×4=12). Tani do të mësojmë si të shumëzojmë numra më të mëdhenj si 23 × 4 ose 15 × 12. Truku është: **ndaji numrat në pjesë të vogla!**',
      mascotMessage: 'Tani bëhemi matematikanë të vërtetë! 🧮',
    },
    {
      type: 'example',
      titleAl: 'Hapi 1: Ndaj dhe Shumëzo',
      contentAl: `
        🔢 **Si shumëzojmë 23 × 4?**

        Imagjino: 23 = 20 + 3

        🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦 🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦 = 20
        🟩🟩🟩 = 3

        Tani shumëzo secilin:
        20 × 4 = **80** (4 grupe me 20)
        3 × 4 = **12** (4 grupe me 3)

        Mblidhi: 80 + 12 = **92** ✓

        ───────────────────────────

        🔢 **Edhe 15 × 6?**

        15 = 10 + 5
        10 × 6 = **60**
        5 × 6 = **30**
        60 + 30 = **90** ✓
      `,
      mascotMessage: 'Ndaj numrin në dhjetësha dhe njësha!',
      tipAl: '23 × 4 = (20 × 4) + (3 × 4) = 80 + 12 = 92',
    },
    {
      type: 'example',
      titleAl: 'Hapi 2: Më Shumë Shembuj',
      contentAl: `
        📝 **Le të ushtrojmë shumë shembuj:**

        🔢 **14 × 3 = ?**
        10 × 3 = 30
        4 × 3 = 12
        30 + 12 = **42** ✓

        🔢 **32 × 5 = ?**
        30 × 5 = 150
        2 × 5 = 10
        150 + 10 = **160** ✓

        🔢 **45 × 2 = ?**
        40 × 2 = 80
        5 × 2 = 10
        80 + 10 = **90** ✓

        🔢 **21 × 7 = ?**
        20 × 7 = 140
        1 × 7 = 7
        140 + 7 = **147** ✓
      `,
      mascotMessage: 'Sa më shumë ushtrime, aq më i mirë bëhesh!',
      tipAl: 'Gjithmonë ndaj në dhjetësha + njësha!',
    },
    {
      type: 'animation',
      titleAl: 'Shiko shumëzimin!',
      contentAl: 'Le të shohim 12 × 4 — 4 grupe me nga 12:',
      animationType: 'multiplication',
      animationNumbers: [12, 4],
      mascotMessage: 'Shiko si grupohen!',
    },
    {
      type: 'example',
      titleAl: 'Hapi 3: Shumëzimi në Kolonë me Mbajtje',
      contentAl: `
        📝 **Si shkruajmë 34 × 5 në kolonë?**

           34
         ×  5
         ────

        **Hapi 1:** Fillo nga njëshat: 4 × 5 = 20
        → Shkruaj **0**, mbart **2** sipër

        **Hapi 2:** Dhjetëshat: 3 × 5 = 15, + 2 = 17
        → Shkruaj **17**

           34
         ×  5
         ────
          170     Përgjigja: **170** ✓

        ─────────────────────────

        📝 **Edhe 46 × 3:**

           46
         ×  3
         ────

        6 × 3 = 18 → shkruaj 8, mbart 1
        4 × 3 = 12, + 1 = 13

          138     Përgjigja: **138** ✓
      `,
      mascotMessage: 'Mbartja kalohet te shifra tjetër! 🤫',
      tipAl: 'Shkruaj gjithmonë mbartjen mbi shifrën tjetër!',
    },
    {
      type: 'example',
      titleAl: 'Hapi 4: Dyshifror × Dyshifror',
      contentAl: `
        🔢 **Si shumëzojmë 24 × 13?**

        Ndaj 13 = 10 + 3

        24 × 10 = **240**
        24 × 3 = **72**
        ──────────────
        240 + 72 = **312** ✓

        ─────────────────────────

        🔢 **Edhe 15 × 12?**

        Ndaj 12 = 10 + 2

        15 × 10 = **150**
        15 × 2 = **30**
        ──────────────
        150 + 30 = **180** ✓

        ─────────────────────────

        🔢 **Edhe 25 × 16?**

        25 × 10 = **250**
        25 × 6 = **150**
        250 + 150 = **400** ✓
      `,
      mascotMessage: 'Ndaj numrin e dytë në dhjetësha dhe njësha!',
      tipAl: 'a × (b+c) = a×b + a×c',
    },
    {
      type: 'example',
      titleAl: 'Hapi 5: Treshifror × Njëshifror',
      contentAl: `
        🔢 **Si shumëzojmë 234 × 3?**

        Ndaj 234 = 200 + 30 + 4

        200 × 3 = **600**
         30 × 3 = **90**
          4 × 3 = **12**
        ─────────────
        600 + 90 + 12 = **702** ✓

        ─────────────────────────

        🔢 **Edhe 125 × 4?**
        100 × 4 = 400
         25 × 4 = 100
        400 + 100 = **500** ✓

        🔢 **Edhe 312 × 3?**
        300 × 3 = 900
         12 × 3 = 36
        900 + 36 = **936** ✓
      `,
      mascotMessage: 'Ndaj numrat e mëdhenj – bëhet shumë e lehtë!',
      tipAl: 'Kontrollo me mbledhje: 702 = 600 + 90 + 12 ✓',
    },
    {
      type: 'example',
      titleAl: 'Probleme me Fjalë',
      contentAl: `
        📚 **Shembull 1:**
        Noari ka 24 kuti. Çdo kuti ka 5 lapsa.
        Sa lapsa ka gjithsej?

        24 × 5 = (20×5) + (4×5) = 100 + 20 = **120 lapsa** ✓

        📚 **Shembull 2:**
        Një klasë ka 28 nxënës. Çdo nxënës ka 4 libra.
        Sa libra ka gjithsej klasa?

        28 × 4 = (20×4) + (8×4) = 80 + 32 = **112 libra** ✓

        📚 **Shembull 3:**
        Në kopsht ka 15 rreshta pemësh. Çdo rresht ka 12 pemë.
        Sa pemë ka gjithsej?

        15 × 12 = (15×10) + (15×2) = 150 + 30 = **180 pemë** ✓
      `,
      mascotMessage: 'Problemet me fjalë janë kudo rreth nesh!',
    },
    {
      type: 'summary',
      titleAl: 'Çfarë mësuam',
      contentAl: `
        ✅ Ndaj numrin dyshifror: 23 = 20 + 3
        ✅ Shumëzo secilin pjesë veç e veç
        ✅ Mblidh rezultatet: 80 + 12 = 92
        ✅ Mëso të shumëzosh në kolonë me mbajtje
        ✅ Dyshifror × Dyshifror: ndaj numrin e dytë gjithashtu
        ✅ Treshifror × Njëshifror: ndaj në qindësha + dhjetësha + njësha
      `,
      mascotMessage: 'Tani je shumëzues i vërtetë! 💪🏆',
    },
  ],
})

// ─── Pjesëtimi Dyshifror/Treshifror ─────────────────────────────────
lessons.push({
  topicId: 'pjestimi_dyshifror',
  titleAl: 'Pjesëtimi i Numrave Dyshifrorë',
  introAl: 'Mësojmë si të pjesëtojmë numra të mëdhenj me metoda të thjeshta!',
  steps: [
    {
      type: 'intro',
      titleAl: 'Çfarë do të mësojmë?',
      contentAl: 'Kemi mësuar pjesëtimin e thjeshtë (12 ÷ 3 = 4). Tani do të mësojmë si të pjesëtojmë numra më të mëdhenj si 84 ÷ 4 ose 246 ÷ 3. Truku është i njëjtë: **ndaji numrat në pjesë të vogla!**',
      mascotMessage: 'Pjesëtimi i gjatë bëhet i lehtë me hapat e duhur! 📐',
    },
    {
      type: 'example',
      titleAl: 'Hapi 1: Ndaj dhe Pjesëto',
      contentAl: `
        🔢 **Si pjesëtojmë 84 ÷ 4?**

        Ndaj 84 në pjesë që mund t'i pjesëtosh lehtë:
        84 = 80 + 4

        80 ÷ 4 = **20** (sa katërsha ka 80?)
         4 ÷ 4 = **1**
        ──────────────
        20 + 1 = **21**

        Kontrollo: 21 × 4 = 84 ✓ Saktë!

        ─────────────────────────

        🔢 **Edhe 63 ÷ 3?**

        63 = 60 + 3
        60 ÷ 3 = **20**
         3 ÷ 3 = **1**
        20 + 1 = **21** ✓
      `,
      mascotMessage: 'Ndaj dhe pjesëto – si me shumëzimin!',
      tipAl: 'Gjithmonë kontrollo duke shumëzuar mbrapsht!',
    },
    {
      type: 'example',
      titleAl: 'Hapi 2: Më Shumë Shembuj',
      contentAl: `
        📝 **Le të ushtrojmë shumë shembuj:**

        🔢 **48 ÷ 4 = ?**
        40 ÷ 4 = 10
         8 ÷ 4 = 2
        10 + 2 = **12** ✓

        🔢 **96 ÷ 3 = ?**
        90 ÷ 3 = 30
         6 ÷ 3 = 2
        30 + 2 = **32** ✓

        🔢 **72 ÷ 6 = ?**
        60 ÷ 6 = 10
        12 ÷ 6 = 2
        10 + 2 = **12** ✓

        🔢 **55 ÷ 5 = ?**
        50 ÷ 5 = 10
         5 ÷ 5 = 1
        10 + 1 = **11** ✓
      `,
      mascotMessage: 'Sa më shumë ushtrime, aq më shpejt bëhesh!',
      tipAl: 'Gjej numrin më të afërt që pjesëtohet saktë!',
    },
    {
      type: 'animation',
      titleAl: 'Shiko ndarjen!',
      contentAl: 'Le të ndajmë 12 bonbone në 4 grupe:',
      animationType: 'division',
      animationNumbers: [12, 4],
      mascotMessage: 'Sa merr çdo grup?',
    },
    {
      type: 'example',
      titleAl: 'Hapi 3: Pjesëtimi i Gjatë (Kolona)',
      contentAl: `
        📝 **Si bëjmë 96 ÷ 3 me kolonë?**

        **Hapi 1:** Shiko shifrën e parë: 9
        Si herë shkon 3 brenda 9? → **3** herë
        Shkruaj 3 sipër. Mbetja: 9 - 9 = 0

        **Hapi 2:** Zbrit shifrën tjetër: 6
        Si herë shkon 3 brenda 6? → **2** herë
        Shkruaj 2 sipër. Mbetja: 6 - 6 = 0

        Rezultati: **32** ✓

        ─────────────────────────

        📝 **Edhe 84 ÷ 4:**

        8 ÷ 4 = **2** → zbrit 4 = 0
        Zbrit shifrën 4
        4 ÷ 4 = **1** → mbetja 0

        Rezultati: **21** ✓
      `,
      mascotMessage: 'Hap pas hapi – kjo është metoda!',
      tipAl: 'Ndaj, shumëzo, zbrit, zbrit shifrën tjetër, përsërit!',
    },
    {
      type: 'example',
      titleAl: 'Hapi 4: Treshifror ÷ Njëshifror',
      contentAl: `
        🔢 **Si pjesëtojmë 246 ÷ 3?**

        240 ÷ 3 = 80
          6 ÷ 3 = 2
        80 + 2 = **82** ✓

        🔢 **Edhe 125 ÷ 5?**
        100 ÷ 5 = 20
         25 ÷ 5 = 5
        20 + 5 = **25** ✓

        🔢 **Edhe 336 ÷ 4?**
        320 ÷ 4 = 80
         16 ÷ 4 = 4
        80 + 4 = **84** ✓

        🔢 **Edhe 420 ÷ 7?**
        420 = 42 × 10
        42 ÷ 7 = 6
        6 × 10 = **60** ✓
      `,
      mascotMessage: 'Ndaj numrin e madh dhe bëhet i lehtë!',
      tipAl: 'Gjej shumëfishin më të afërt të pjesëtuesit!',
    },
    {
      type: 'example',
      titleAl: 'Probleme me Fjalë',
      contentAl: `
        📚 **Shembull 1:**
        168 libra ndahen në 7 raft të barabarta.
        Sa libra ka çdo raft?

        140 ÷ 7 = 20
         28 ÷ 7 = 4
        20 + 4 = **24 libra** për çdo raft ✓

        📚 **Shembull 2:**
        96 bonbone ndahen midis 8 fëmijëve.
        Sa bonbone merr secili?

        80 ÷ 8 = 10
        16 ÷ 8 = 2
        10 + 2 = **12 bonbone** secili ✓

        📚 **Shembull 3:**
        252 vezë vendosen në kuti me 12 veze.
        Sa kuti nevojiten?

        240 ÷ 12 = 20
         12 ÷ 12 = 1
        20 + 1 = **21 kuti** ✓
      `,
      mascotMessage: 'Problemet me fjalë bëhen të lehta me pjesëtim!',
    },
    {
      type: 'summary',
      titleAl: 'Çfarë mësuam',
      contentAl: `
        ✅ Ndaj numrin e madh: 84 = 80 + 4
        ✅ Pjesëto secilin pjesë: 80÷4=20, 4÷4=1
        ✅ Mblidh rezultatet: 20 + 1 = 21
        ✅ Kontrollo gjithmonë me shumëzim!
        ✅ Pjesëtimi i gjatë: ndaj, shumëzo, zbrit, zbrit shifrën
        ✅ Treshifror ÷ njëshifror: ndaj në qindësha + dhjetësha
      `,
      mascotMessage: 'Tani je ekspert i pjesëtimit! 🌟🏆',
    },
  ],
})

// ─── Thyesat ─────────────────────────────────────────────────────────
lessons.push({
  topicId: 'thyesat',
  titleAl: 'Mësojmë Thyesat',
  introAl: 'Thyesat tregojnë pjesë të një tërësie – si fetat e picës!',
  steps: [
    {
      type: 'intro',
      titleAl: 'Çfarë janë Thyesat?',
      contentAl: `Imagjino një picë. E pret në 4 copa të barabarta.

Merr 1 copë. Ti more **1 copë nga 4** gjithsej.

Kjo shkruhet: **1/4** (lexohet: "një e katërta")

Thyesat janë kudo rreth nesh:
• Gjysma e mollës = **1/2**
• Çereku i tortës = **1/4**
• Tre feta nga tetë = **3/8**`,
      mascotMessage: 'Thyesat janë kudo rreth nesh – në pica, cokollatë, e kudo! 🍕',
    },
    {
      type: 'example',
      titleAl: 'Pjesët e Thyesës: Numëruesi dhe Emëruesi',
      contentAl: `
        🍕 **Thyesa ka DY pjesë:**

              3   ← **NUMËRUESI** (sa pjesë MARRIM)
             ───
              8   ← **EMËRUESI** (sa pjesë KA GJITHSEJ)

        **Mendo kështu:**
        Emëruesi = në SA copa e prisni? (emëruesi EMËRON — i jep emër thyesës)
        Numëruesi = SA copa merrni? (numëruesi NUMËRON — numëron copat)

        **Shembuj me vizatime:**

        🍕 Pica me 8 feta → marr 3 feta → **3/8**
           Emëruesi = 8 (ka 8 feta gjithsej)
           Numëruesi = 3 (marr 3 feta)

        🟦 Katror me 4 pjesë → ngjyros 1 → **1/4**
           Emëruesi = 4 (ka 4 pjesë gjithsej)
           Numëruesi = 1 (ngjyrosa 1 pjesë)

        🟩 Shirit me 6 pjesë → ngjyros 2 → **2/6**
      `,
      mascotMessage: 'Numëruesi sipër, emëruesi poshtë! Kaq e thjeshtë!',
      tipAl: 'Emëruesi = GJITHSEJ, Numëruesi = SA MARR',
    },
    {
      type: 'example',
      titleAl: 'Thyesat me Pica 🍕',
      contentAl: `
        🍕 **Pica e Noarit (prerë në 8 feta):**

        🍕 Marr 1 fetë → **1/8** = "një e teta"
        🍕🍕 Marr 2 feta → **2/8** = "dy të tetat"
        🍕🍕🍕 Marr 3 feta → **3/8** = "tre të tetat"
        🍕🍕🍕🍕 Marr 4 feta → **4/8** = "katër të tetat" (gjysma!)
        🍕🍕🍕🍕🍕🍕🍕🍕 Marr 8 feta → **8/8 = 1** (e tëra pica!)

        ─────────────────────────

        🍕 **Pica tjetër (prerë në 4 feta):**

        🍕 Marr 1 fetë → **1/4** = "një e katërta" (çereku)
        🍕🍕 Marr 2 feta → **2/4** = "dy të katërtat" (gjysma!)
        🍕🍕🍕 Marr 3 feta → **3/4** = "tre të katërtat"
        🍕🍕🍕🍕 Marr 4 feta → **4/4 = 1** (e tëra!)
      `,
      mascotMessage: 'Sa feta marr, aq më e madhe bëhet thyesa!',
      tipAl: 'Kur numëruesi = emëruesi, thyesa = 1 (e tëra)',
    },
    {
      type: 'example',
      titleAl: 'Thyesat me Katrorë dhe Rrethe',
      contentAl: `
        🟦 **Katrori (4 pjesë):**
        ┌──┬──┐
        │🔵│  │   → Ngjyrosa 1 nga 4 = **1/4**
        ├──┼──┤
        │  │  │
        └──┴──┘

        ┌──┬──┐
        │🔵│🔵│   → Ngjyrosa 3 nga 4 = **3/4**
        ├──┼──┤
        │🔵│  │
        └──┴──┘

        🟩 **Drejtkëndëshi (6 pjesë):**
        [🟩][🟩][🟩][ ][ ][ ] → 3 nga 6 = **3/6** (= 1/2!)

        🔵 **Rrethi (3 pjesë):**
        Imagjino picën prerë në 3 → marr 2 → **2/3**

        **Si i lexojmë thyesat?**
        1/2 = "një gjysmë"
        1/3 = "një e treta"
        1/4 = "një e katërta" (çereku)
        2/3 = "dy të tretat"
        3/8 = "tre të tetat"
      `,
      mascotMessage: 'Shiko figurat dhe numëro pjesët e ngjyrosura!',
    },
    {
      type: 'example',
      titleAl: 'Thyesat e Numrave të Vegjël',
      contentAl: `
        🔢 **Gjej thyesën e një numri:**

        Rregulli: **Pjesëto numrin me emëruesin!**

        ─────────────────────────

        **1/2 e numrit 10?**
        10 ÷ 2 = **5** ✓
        (gjysma e 10 është 5)

        **1/2 e numrit 6?**
        6 ÷ 2 = **3** ✓

        **1/3 e numrit 9?**
        9 ÷ 3 = **3** ✓

        **1/4 e numrit 8?**
        8 ÷ 4 = **2** ✓

        **1/5 e numrit 15?**
        15 ÷ 5 = **3** ✓

        **1/4 e numrit 20?**
        20 ÷ 4 = **5** ✓

        Mendoje kështu: 1/4 e 8 = "ndaje 8 në 4 grupe, merr 1 grup"
        8 ÷ 4 = 2 → merr **2**
      `,
      mascotMessage: 'Pjesëto me emëruesin — kaq thjeshtë!',
      tipAl: '1/b e numrit n = n ÷ b',
    },
    {
      type: 'example',
      titleAl: 'Thyesat e Numrave të Mëdhenj',
      contentAl: `
        🔢 **Thyesat e numrave të mëdhenj:**

        **1/4 e numrit 100?**
        100 ÷ 4 = **25** ✓
        (çereku i 100 është 25)

        **1/2 e numrit 100?**
        100 ÷ 2 = **50** ✓

        **1/5 e numrit 100?**
        100 ÷ 5 = **20** ✓

        **1/10 e numrit 100?**
        100 ÷ 10 = **10** ✓

        **1/4 e numrit 40?**
        40 ÷ 4 = **10** ✓

        **1/3 e numrit 30?**
        30 ÷ 3 = **10** ✓

        **1/2 e numrit 200?**
        200 ÷ 2 = **100** ✓

        Rregulli: Gjithmonë PJESËTO me emëruesin!
      `,
      mascotMessage: 'Edhe numrat e mëdhenj bëhen të lehtë! 💪',
      tipAl: '1/4 e 100 = 100 ÷ 4 = 25',
    },
    {
      type: 'example',
      titleAl: 'Kur Numëruesi është Më i Madh se 1',
      contentAl: `
        🔢 **Rregulli i Artë:**
        Thyesa e numrit = (Numri ÷ Emëruesi) × Numëruesi

        **Dy hapa:**
        1️⃣ Gjej 1 pjesë → pjesëto me emëruesin
        2️⃣ Merr sa të duash → shumëzo me numëruesin

        ─────────────────────────

        **3/4 e numrit 8?**
        Hapi 1: 8 ÷ 4 = 2 (1/4 e 8 = 2)
        Hapi 2: 2 × 3 = **6** (3/4 e 8 = 6) ✓

        **2/3 e numrit 12?**
        Hapi 1: 12 ÷ 3 = 4 (1/3 e 12 = 4)
        Hapi 2: 4 × 2 = **8** (2/3 e 12 = 8) ✓

        **3/4 e numrit 100?**
        Hapi 1: 100 ÷ 4 = 25 (1/4 e 100 = 25)
        Hapi 2: 25 × 3 = **75** (3/4 e 100 = 75) ✓

        **2/5 e numrit 100?**
        Hapi 1: 100 ÷ 5 = 20 (1/5 e 100 = 20)
        Hapi 2: 20 × 2 = **40** (2/5 e 100 = 40) ✓
      `,
      mascotMessage: 'Dy hapa: Pjesëto pa shumëzo!',
      tipAl: 'a/b e numrit n = (n ÷ b) × a',
    },
    {
      type: 'example',
      titleAl: 'Më Shumë Ushtrime me Thyesat e Numrave',
      contentAl: `
        📝 **Le të ushtrojmë shumë shembuj:**

        **3/9 e numrit 9?**
        9 ÷ 9 = 1 (1/9 e 9)
        1 × 3 = **3** ✓
        (ose thjesht: 3/9 = 1/3, dhe 1/3 e 9 = 3!)

        **3/9 e numrit 3?**
        3 ÷ 9... nuk ndahet! Por mendoje kështu:
        3/9 = 1/3 (thyesë e barabartë)
        1/3 e 3 = 3 ÷ 3 = **1** ✓

        **5/8 e numrit 16?**
        16 ÷ 8 = 2
        2 × 5 = **10** ✓

        **2/4 e numrit 100?**
        100 ÷ 4 = 25
        25 × 2 = **50** ✓
        (2/4 = 1/2, dhe gjysma e 100 = 50!)

        **7/8 e numrit 24?**
        24 ÷ 8 = 3
        3 × 7 = **21** ✓

        **4/5 e numrit 10?**
        10 ÷ 5 = 2
        2 × 4 = **8** ✓
      `,
      mascotMessage: 'Praktika bën mjeshtrin! 📚',
      tipAl: '3/9 = 1/3 janë thyesa të barabarta!',
    },
    {
      type: 'example',
      titleAl: 'Thyesat e Barabarta',
      contentAl: `
        🟰 **Thyesa të ndryshme, vlerë e njëjtë:**

        Imagjino: Pret picën në 2 copa, marr 1 = **1/2**
        Pret picën në 4 copa, marr 2 = **2/4**
        Pret picën në 8 copa, marr 4 = **4/8**

        E njëjta sasi pice! Pra:
        **1/2 = 2/4 = 4/8** (gjithmonë gjysma!)

        ─────────────────────────

        **Më shumë thyesa të barabarta:**
        1/3 = 2/6 = 3/9  (gjithmonë një e treta)
        1/4 = 2/8 = 3/12 (gjithmonë çereku)
        2/3 = 4/6 = 6/9

        **Si e dimë?**
        Shumëzo sipër DHE poshtë me të njëjtin numër:
        1/3 → shumëzo me 3 → 3/9 ✓
        2/4 → thjesht me 2 → 1/2 ✓
      `,
      mascotMessage: 'Thyesat e barabarta janë si emra të ndryshëm për të njëjtën gjë! 🟰',
      tipAl: '1/3 = 2/6 = 3/9 — gjithmonë e njëjta thyesë!',
    },
    {
      type: 'example',
      titleAl: 'Krahasimi i Thyesave',
      contentAl: `
        ⚖️ **Cila thyesë është MË E MADHE?**

        **Rregull 1: Emëruesi i njëjtë**
        3/8 apo 5/8? → **5/8 > 3/8**
        (numëruesi më i madh = thyesë më e madhe)

        **Rregull 2: Numëruesi i njëjtë**
        1/2 apo 1/4? → **1/2 > 1/4**
        (emëruesi më i VOGËL = thyesë më e MADHE!)

        🤔 **Pse?** Imagjino:
        Picën e pret në 2 copa → çdo copë MADHE
        Picën e pret në 4 copa → çdo copë VOGËL

        **Rregull 3: Krahasohet me 1/2**
        3/4 > 1/2 (sepse 3/4 > 2/4)
        2/8 < 1/2 (sepse 2/8 < 4/8)
      `,
      mascotMessage: 'Kur copat janë më pak, secila copë është më e madhe! ⚖️',
      tipAl: '1/2 > 1/4 > 1/8 → sa më i madh emëruesi, aq më e vogël thyesa',
    },
    {
      type: 'example',
      titleAl: 'Probleme me Fjalë me Thyesat',
      contentAl: `
        📚 **Shembull 1:**
        Noari ka 12 lapsa. Dha 1/4 e tyre. Sa dha?
        12 ÷ 4 = **3 lapsa** ✓

        📚 **Shembull 2:**
        Klasa ka 20 nxënës. 3/4 erdhën sot. Sa erdhën?
        20 ÷ 4 = 5 → 5 × 3 = **15 nxënës** ✓

        📚 **Shembull 3:**
        Torta ka 8 copa. Noari hëngri 3. Çfarë thyese hëngri?
        Hëngri 3 nga 8 → **3/8** ✓

        📚 **Shembull 4:**
        Çanta ka 100 fletë. Noari përdori 1/4. Sa përdori?
        100 ÷ 4 = **25 fletë** ✓

        📚 **Shembull 5:**
        Banka ka 9 mollë. Nëna marri 3/9. Sa marri?
        9 ÷ 9 = 1 → 1 × 3 = **3 mollë** ✓
        (ose: 3/9 = 1/3, dhe 1/3 e 9 = 3!)
      `,
      mascotMessage: 'Thyesat janë kudo në jetën tonë!',
    },
    {
      type: 'summary',
      titleAl: 'Çfarë mësuam',
      contentAl: `
        ✅ Thyesa = numëruesi / emëruesi
        ✅ Numëruesi = sa pjesë MARRIM
        ✅ Emëruesi = sa pjesë KA GJITHSEJ
        ✅ 1/2 = gjysma, 1/4 = çereku
        ✅ 1/b e numrit n = n ÷ b (thjesht PJESËTO!)
        ✅ a/b e numrit n = (n ÷ b) × a (pjesëto pa shumëzo)
        ✅ 1/4 e 100 = 25, 3/4 e 100 = 75
        ✅ 3/9 = 1/3 (thyesa të barabarta)
        ✅ Praktikou me pica dhe figura!
      `,
      mascotMessage: 'Tani je ekspert i thyesave! Provo drag-and-drop! 🍕🏆',
    },
  ],
})

export function getLessonByTopicId(topicId: string): Lesson | undefined {
  return lessons.find(l => l.topicId === topicId)
}
