const tasks = [
    {
      category: "GROS-ŒUVRES ET ETANCHEITE",
      subcategories: [
            {
              name :"GROS-ŒUVRES ET ETANCHEITE",
              tasks:[
                { name: "FONDATION", percentage: "15" },
                { name: "ELEVATION", percentage: "25" },
                { name: "ETANCHEITE", percentage: "5" },
              ]
            }
      ],
    },
    {
      category: "LOTS SECONDAIRES",
      subcategories: [
        {
          name: "ELECTRICITE",
          tasks: [
            { name: "FILERIE", percentage: "5" },
            { name: "LUSTRE", percentage: "5" },
          ],
        },
        {
          name: "PLOMBERIE SANITAIRE ET ASSAINISSEMENT",
          tasks: [
            { name: "CONDUITES ET TUYAUTERIES", percentage: "2" },
            { name: "APPAREILS SANITAIRES", percentage: "3" },
          ],
        },
        {
          name: "أشغال النجارة MENUISERIE",
          tasks: [
            { name: "المصاريع OUVRANTS: PORTES FENETRE PLACARDS …..", percentage: "6" },
            { name: "عقاقير النجارة QUICAILLERIE", percentage: "2" },
            { name: "النجارة الحديدية MENUISERIE METALLIQUE GRILLES ", percentage: "2" },
          ],
        },
        {
          name: "أشغال التبليط REVETEMENT",
          tasks: [
            { name: "تبليط الأرض REVETEMENT SOL", percentage: "7" },
            { name: "تبليط الجدران REVETEMENT MURS", percentage: "3" },
          ],
        },
        {
          name: "أشغال الصباغة والزجاج PEINTURE VITRERIE",
          tasks: [
            { name: "صباغة داخلية PEINTURE INTERIEURE", percentage: "5" },
            { name: "صباغة خارجية PEINTURE EXTERIEURE", percentage: "3" },
            { name: "الزجاج VITRERIE", percentage: "2" },
          ],
        },
        {
          name: "تهيئة خارجية AMENAGEMENT EXTERIEUR",
          tasks: [
            { name: "السور MURS DE CLOTURE", percentage: "4" },
            { name: "ممرات ومرائب CIRCULATION ET PARKINGS", percentage: "2" },
            { name: "الزجاج VITRERIE", percentage: "2" },
            { name: "الربط بالشبكات BRANCHEMENTS AUX RESEAUX DIVERS", percentage: "2" },
          ],
        },
      ],
    },
  ];
  export {tasks};