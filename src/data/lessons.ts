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
      contentAl: 'Kemi mësuar tabelën e shumëzimit. Tani do të mësojmë si të shumëzojmë numra si 23 × 4 ose 15 × 12. Ky quhet shumëzimi me numra dyshifrorë dhe treshifrorë!',
      mascotMessage: 'Tani bëhemi matematikanë të vërtetë! 🧮',
    },
    {
      type: 'example',
      titleAl: 'Metoda e Ndarjes (Dyshifror × Njëshifror)',
      contentAl: `
        🔢 **Si shumëzojmë 23 × 4?**

        **Hapi 1:** Ndaj 23 në dhjetësha dhe njësha
        23 = 20 + 3

        **Hapi 2:** Shumëzo secilin veç e veç
        20 × 4 = 80
        3 × 4 = 12

        **Hapi 3:** Mblidh rezultatet
        80 + 12 = **92**

        Pra, 23 × 4 = 92 ✓
      `,
      mascotMessage: 'Ndaj dhe shumëzo – truku i artë! ✨',
      tipAl: 'Gjithmonë fillo nga njëshat, pastaj dhjetëshat!',
    },
    {
      type: 'example',
      titleAl: 'Shumëzimi me Mbajtje (Kolonë)',
      contentAl: `
        📝 **Si shkruajmë 34 × 5 në kolonë?**

           34
         ×  5
         ────

        **Hapi 1:** 4 × 5 = 20 → Shkruaj 0, mbart 2
        **Hapi 2:** 3 × 5 = 15, + 2 (mbartja) = 17

           34
         ×  5
         ────
          170

        Pra, 34 × 5 = 170 ✓
      `,
      mascotMessage: 'Mbartja është miku ynë i fshehtë! 🤫',
      tipAl: 'Shkruaj gjithmonë mbartjen mbi shifrën tjetër!',
    },
    {
      type: 'animation',
      titleAl: 'Shiko shumëzimin!',
      contentAl: 'Le të shohim 12 × 4:',
      animationType: 'multiplication',
      animationNumbers: [12, 4],
      mascotMessage: 'Shiko si grupohen!',
    },
    {
      type: 'example',
      titleAl: 'Dyshifror × Dyshifror',
      contentAl: `
        🔢 **Si shumëzojmë 24 × 13?**

        **Metoda e Ndarjes:**
        24 × 13 = 24 × (10 + 3)

        24 × 10 = 240
        24 ×  3 =  72
        ──────────────
        Gjithsej  = 312

        Pra, 24 × 13 = **312** ✓
      `,
      mascotMessage: 'Ndaj numrin e dytë gjithashtu!',
      tipAl: '24 × 13 = (24 × 10) + (24 × 3) = 240 + 72 = 312',
    },
    {
      type: 'example',
      titleAl: 'Treshifror × Njëshifror',
      contentAl: `
        🔢 **Si shumëzojmë 234 × 3?**

        **Ndaj 234:**
        200 × 3 = 600
         30 × 3 =  90
          4 × 3 =  12
        ─────────────
        Gjithsej = 702

        Pra, 234 × 3 = **702** ✓

        🔢 **Edhe 125 × 4:**
        100 × 4 = 400
         25 × 4 = 100
        400 + 100 = **500**
      `,
      mascotMessage: 'Ndaj numrat e mëdhenj – bëhet shumë e lehtë!',
      tipAl: 'Kontrollo me mbledhje: 702 = 600 + 90 + 12 ✓',
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
      contentAl: 'Kemi mësuar pjesëtimin e thjeshtë (12 ÷ 3). Tani do të mësojmë si të pjesëtojmë numra si 84 ÷ 4 ose 246 ÷ 3. Quhet "pjesëtimi i gjatë" ose "pjesëtimi me numra dyshifrorë"!',
      mascotMessage: 'Pjesëtimi i gjatë bëhet i lehtë me hapat e duhur! 📐',
    },
    {
      type: 'example',
      titleAl: 'Metoda e Ndarjes (Dyshifror ÷ Njëshifror)',
      contentAl: `
        🔢 **Si pjesëtojmë 84 ÷ 4?**

        **Metoda e Ndarjes:**
        84 = 80 + 4

        80 ÷ 4 = 20
         4 ÷ 4 =  1
        ──────────────
        Gjithsej = **21**

        Kontrollo: 21 × 4 = 84 ✓
      `,
      mascotMessage: 'Ndaj dhe pjesëto – si me shumëzimin!',
      tipAl: 'Gjithmonë kontrollo duke shumëzuar mbrapsht!',
    },
    {
      type: 'example',
      titleAl: 'Pjesëtimi i Gjatë (Kolona)',
      contentAl: `
        📝 **Si bëjmë 96 ÷ 3 me kolonë?**

        **Hapi 1:** Si herë shkon 3 brenda 9? → 3 herë
        **Hapi 2:** 3 × 3 = 9 → Mbetja: 9 - 9 = 0
        **Hapi 3:** Zbrit shifrën tjetër: 6
        **Hapi 4:** Si herë shkon 3 brenda 6? → 2 herë
        **Hapi 5:** 3 × 2 = 6 → Mbetja: 0

        Rezultati: **32**

        Kontrollo: 32 × 3 = 96 ✓
      `,
      mascotMessage: 'Hap pas hapi – kjo është metoda!',
      tipAl: 'Pjesëtimi i gjatë: ndaj, shumëzo, zbrit, zbrit shifrën tjetër!',
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
      titleAl: 'Treshifror ÷ Njëshifror',
      contentAl: `
        🔢 **Si pjesëtojmë 246 ÷ 3?**

        **Metoda e Ndarjes:**
        240 ÷ 3 = 80
          6 ÷ 3 =  2
        ──────────────
        Gjithsej = **82**

        Kontrollo: 82 × 3 = 246 ✓

        🔢 **Edhe 125 ÷ 5:**
        100 ÷ 5 = 20
         25 ÷ 5 =  5
        20 + 5 = **25**
      `,
      mascotMessage: 'Ndaj numrin e madh dhe bëhet i lehtë!',
      tipAl: '246 ÷ 3: Shiko 240 (shumëfish i 3) + 6 (shumëfish i 3)',
    },
    {
      type: 'example',
      titleAl: 'Probleme me Fjalë',
      contentAl: `
        📚 **Shembull 1:**
        168 libra ndahen në 7 raft të barabarta.
        Sa libra ka çdo raft?

        168 ÷ 7 = ?
        140 ÷ 7 = 20
         28 ÷ 7 =  4
        20 + 4 = **24 libra** secili raft ✓

        📚 **Shembull 2:**
        252 vezë vendosen në kuti me 12 veze.
        Sa kuti nevojiten?

        252 ÷ 12 = 21 kuti ✓
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
      contentAl: 'Kur e ndajmë diçka në pjesë të barabarta, çdo pjesë quhet thyesë. Nëse e ndajmë picën në 4 feta dhe marrim 1 fetë, marrim 1/4 (një të katërtën) e picës!',
      mascotMessage: 'Thyesat janë kudo rreth nesh – në pica, cokollatë, e kudo! 🍕',
    },
    {
      type: 'example',
      titleAl: 'Pjesët e Thyesës',
      contentAl: `
        🍕 **Thyesa ka dy pjesë:**

              3   ← Numëruesi (sa pjesë marrim)
             ───
              8   ← Emëruesi (sa pjesë ka gjithsej)

        **Shembuj:**
        🍕 Pica me 8 feta – marr 3 feta = **3/8** (tre të tetat)
        🟦 Katror me 4 pjesë – ngjyros 1 = **1/4** (një e katërta)
        🔵 Rreth me 2 pjesë – merr 1 = **1/2** (gjysma)

        Numëruesi = sa marrim
        Emëruesi = sa ka gjithsej
      `,
      mascotMessage: 'Numëruesi është sipër, emëruesi është poshtë!',
      tipAl: 'Emëruesi tregon sa copëza ka e tëra gjithsej!',
    },
    {
      type: 'example',
      titleAl: 'Thyesat me Pica 🍕',
      contentAl: `
        🍕 **Pica e Noarit:**
        Pica është prerë në **8 feta** të barabarta.

        • Marr **1 fetë** → Thyesa: **1/8**
        • Marr **3 feta** → Thyesa: **3/8**
        • Marr **5 feta** → Thyesa: **5/8**
        • Marr **8 feta** → Thyesa: **8/8 = 1** (e tëra!)

        Numëruesi rritet sa herë marrim më shumë feta!
        Emëruesi mbetet **8** gjithmonë (ka 8 feta gjithsej).
      `,
      mascotMessage: 'Sa feta marr sot? Gjithmonë numëro thyesën! 😄',
      tipAl: 'Kur numëruesi = emëruesi, thyesa = 1 (e tëra)',
    },
    {
      type: 'example',
      titleAl: 'Thyesat me Katrorë dhe Rrethe',
      contentAl: `
        🟦 **Katrori:**
        Ndajmë katrorin në 4 pjesë.
        Ngjyrosim 3 → thyesa = **3/4**

        🔵 **Rrethi:**
        Ndajmë rreth in 6 pjesë.
        Ngjyrosim 4 → thyesa = **4/6**

        🟩 **Drejtkëndëshi:**
        Ndajmë drejtkëndëshin në 5 pjesë.
        Ngjyrosim 2 → thyesa = **2/5**

        **Si lexojmë thyesat:**
        1/2 = "një gjysmë" (gjysma)
        1/4 = "një e katërta" (çereku)
        3/8 = "tre të tetat"
        2/3 = "dy të tretat"
      `,
      mascotMessage: 'Shiko figurat dhe numëro pjesët e ngjyrosura!',
    },
    {
      type: 'example',
      titleAl: 'Thyesat e Numrave',
      contentAl: `
        🔢 **Thyesa e numrave:**

        **1/2 e numrit 10:**
        10 ÷ 2 = **5**  (gjysma e 10 është 5)

        **1/4 e numrit 12:**
        12 ÷ 4 = **3**  (çereku i 12 është 3)

        **3/4 e numrit 8:**
        8 ÷ 4 = 2 (gjej 1/4 së pari)
        2 × 3 = **6** (shumëzo me numëruesin)

        **Rregulli:** Pjesëto me emëruesin, shumëzo me numëruesin!
      `,
      mascotMessage: 'Gjej 1/4 dhe shumëzo për të gjetur 3/4! 🧠',
      tipAl: 'a/b e numrit n = (n ÷ b) × a',
    },
    {
      type: 'example',
      titleAl: 'Krahasimi i Thyesave',
      contentAl: `
        ⚖️ **Cila thyesë është më e madhe?**

        **1/2 apo 1/4?**
        → 1/2 > 1/4 (gjysma > çereku)
        Kur emëruesi është MÊ I VOGËL, thyesa është MÊ E MADHE!

        **3/8 apo 5/8?**
        → 5/8 > 3/8 (emëruesi njëjtë, numëruesi më i madh)
        Kur emëruesi është I NJËJTË, numëruesi i madh → thyesa e madhe!

        **Thyesat e barabarta:**
        1/2 = 2/4 = 4/8 (njëlloj – gjysma e secilës)
      `,
      mascotMessage: 'Krahasimi i thyesave bëhet i lehtë kur e kupton! ⚖️',
      tipAl: '1/2 = 2/4 = 3/6 = 4/8 – gjithmonë gjysma!',
    },
    {
      type: 'summary',
      titleAl: 'Çfarë mësuam',
      contentAl: `
        ✅ Thyesa = numëruesi / emëruesi
        ✅ Numëruesi = sa pjesë marrim
        ✅ Emëruesi = sa pjesë ka gjithsej
        ✅ 1/2 = gjysma, 1/4 = çereku
        ✅ Thyesa e numrit: pjesëto me emëruesin, shumëzo me numëruesin
        ✅ Praktikou me pica dhe figura!
      `,
      mascotMessage: 'Tani je ekspert i thyesave! Provo drag-and-drop! 🍕🏆',
    },
  ],
})

export function getLessonByTopicId(topicId: string): Lesson | undefined {
  return lessons.find(l => l.topicId === topicId)
}
