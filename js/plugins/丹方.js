
const ElixirData = [
    /*
    name丹方名字
    id丹方id
    item是材料
    value是增加熟练度
    exp是炼丹增加经验
    rate是炼丹成功概率
    complete是炼丹成功后产出的丹药
    random是随机产出丹药数量，写1则为不随机
    oldId显示对应丹方说明，丹方物品需备注<追加情报窗口前: 详细说明>
    */
    /*材料格式： item: [材料id, 数量, 材料id, 数量，...]用多少写多少*/
  /*····························下面为突破丹药配方····························*/
    {
        name: '筑基丹',
        id: 1,
        item: [283, 1, 284, 3],
        value: 1,
        exp: 15,
        rate: 100,
        complete: 32,
        random: 1,
        oldId: 152
    },
    {
        name: '青霜丹',
        id: 2,
        item: [282, 1, 283, 1,284, 5],
        value: 1,
        exp: 20,
        rate: 100,
        complete: 33,
        random: 1,
        oldId: 153
    },
    {
        name: '浑天丹',
        id: 3,
        item: [286, 1, 287, 4],
        value: 1,
        exp: 50,
        rate: 100,
        complete: 34,
        random: 1,
        oldId: 154
    },
    {
        name: '水韵丹',
        id: 4,
        item: [285, 1, 286, 1,287, 6],
        value: 1,
        exp: 75,
        rate: 100,
        complete: 35,
        random: 1,
        oldId: 155
    },
    {
        name: '太清玉魂丹',
        id: 5,
        item: [289, 2, 290, 5],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 36,
        random: 1,
        oldId: 156
    },
    {
        name: '仙芝漱魂丹',
        id: 6,
        item: [288, 1, 289, 2, 290, 8],
        value: 1,
        exp: 125,
        rate: 100,
        complete: 37,
        random: 1,
        oldId: 157
    },
    {
        name: '玉华丹',
        id: 7,
        item: [292, 3, 290, 4],
        value: 1,
        exp: 150,
        rate: 100,
        complete: 38,
        random: 1,
        oldId: 158
    },
    {
        name: '三花玉露丹',
        id: 8,
        item: [291, 3, 292, 2, 290, 6 ],
        value: 1,
        exp: 175,
        rate: 100,
        complete: 39,
        random: 1,
        oldId: 159
    },
    {
        name: '固魂丹',
        id: 9,
        item: [294, 3, 290, 3],
        value: 1,
        exp: 200,
        rate: 100,
        complete: 40,
        random: 1,
        oldId: 160
    },
    {
        name: '三转青莲丹',
        id: 10,
        item: [293, 1, 289, 3, 290, 9 ],
        value: 1,
        exp: 225,
        rate: 100,
        complete: 41,
        random: 1,
        oldId: 161
    },
    {
        name: '驱星锻体丹',
        id: 11,
        item: [296, 1, 297, 3 ],
        value: 1,
        exp: 250,
        rate: 100,
        complete: 42,
        random: 1,
        oldId: 162
    },
    {
        name: '通幽玄体丹',
        id: 12,
        item: [295, 1, 297, 5 ],
        value: 1,
        exp: 275,
        rate: 100,
        complete: 43,
        random: 1,
        oldId: 163
    },
    {
        name: '无极合道丹',
        id: 13,
        item: [299, 1, 300, 3 ],
        value: 1,
        exp: 300,
        rate: 100,
        complete: 44,
        random: 1,
        oldId: 164
    },
    {
        name: '大道通玄丹',
        id: 14,
        item: [298, 1, 300, 5 ],
        value: 1,
        exp: 325,
        rate: 100,
        complete: 45,
        random: 1,
        oldId: 165
    },
    {
        name: '地魄渡劫丹',
        id: 15,
        item: [302, 1, 303, 3 ],
        value: 1,
        exp: 350,
        rate: 100,
        complete: 46,
        random: 1,
        oldId: 166
    },
    {
        name: '天魂化劫丹',
        id: 16,
        item: [301, 1, 298, 3 ],
        value: 1,
        exp: 375,
        rate: 100,
        complete: 47,
        random: 1,
        oldId: 167
    },
    {
        name: '九转化境丹',
        id: 17,
        item: [304, 1, 302, 9 ],
        value: 1,
        exp: 400,
        rate: 100,
        complete: 48,
        random: 1,
        oldId: 168
    },

    /*····························下面为其他丹药配方····························*/

    {
        name: '金乌丸',
        id: 18,
        item: [176, 3, 177, 1],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 2,
        random: 3,
        oldId: 86
    },
    {
        name: '紫飒露',
        id: 19,
        item: [188, 3, 189, 2],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 3,
        random: 3,
        oldId: 87
    },
    {
        name: '精气丹',
        id: 20,
        item: [352, 2, 353, 1],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 4,
        random: 3,
        oldId: 88
    },
    {
        name: '玄元丹',
        id: 21,
        item: [178, 1, 179, 1, 180, 1],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 5,
        random: 3,
        oldId: 89
    },
    {
        name: '回气丹',
        id: 22,
        item: [511, 2, 512, 2],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 6,
        random: 3,
        oldId: 90
    },
    {
        name: '梦清散',
        id: 23,
        item: [354, 1, 355, 2],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 7,
        random: 3,
        oldId: 91
    },
    {
        name: '凝火丹',
        id: 24,
        item: [497, 2, 498, 3],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 10,
        random: 3,
        oldId: 92
    },
    {
        name: '金髓丸',
        id: 25,
        item: [499, 3, 500, 2],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 11,
        random: 3,
        oldId: 93
    },
    {
        name: '六乌金散',
        id: 26,
        item: [501, 2, 502, 1, 503, 2],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 12,
        random: 3,
        oldId: 94
    },
    {
        name: '元神丹',
        id: 27,
        item: [504, 2, 505, 3],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 13,
        random: 3,
        oldId: 95
    },
    {
        name: '九窍金丹',
        id: 28,
        item: [506, 3, 507, 2],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 14,
        random: 3,
        oldId: 96
    },
    {
        name: '千幻万月散',
        id: 29,
        item: [508, 2, 509, 1, 510, 1],
        value: 1,
        exp: 100,
        rate: 100,
        complete: 15,
        random: 3,
        oldId: 97
    },
];