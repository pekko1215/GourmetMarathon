var ItemData = [{
        "name": "オレンジ",
        "type": "use",
        "hp": 5,
        "chip": "",
        "rarity": 1,
        "text": "甘くて美味しい。5回復"
    },
    {
        "name": "リンゴ",
        "type": "use",
        "hp": 10,
        "rarity": 2,
        "chip": "",
        "text": "しゃくしゃくとした食感がよい。10回復"
    },
    {
        "name": "ブドウ",
        "type": "use",
        "hp": 20,
        "chip": "",
        "rarity": 2,
        "text": "皮ごと食べれる。甘い。20回復"
    },
    {
        "name": "メロン",
        "type": "use",
        "hp": 50,
        "chip": "",
        "rarity": 3,
        "text": "これが高級品の力だ。50回復"
    },
    {
        "name": "きのこ",
        "type": "use",
        "hp": 12,
        "text": "何の変哲もないきのこ。12回復",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "やばいきのこ",
        "type": "use",
        "hp": -12,
        "effect": "poison",
        "text": "見るからにやばいきのこ。12ダメージ+毒",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "よわいつめ",
        "type": "eq",
        "atk": 6,
        "text": "貧弱なつめ、素手よりまし…かも？ atk+6",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "ふつうのつめ",
        "type": "eq",
        "atk": 14,
        "text": "一般的なつめ、戦いにはなる atk+14",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "つよいつめ",
        "type": "eq",
        "atk": 32,
        "text": "強靭なつめ、大抵の雑魚には勝てる atk+32",
        "rarity": 3,
        "chip": ""
    },
    {
        "name": "でんせつのつめ",
        "type": "eq",
        "atk": 99,
        "text": "まさにでんせつ。ちょうつおい atk+99",
        "rarity": 5,
        "chip": ""
    },
    {
        "name": "ぼろいマント",
        "type": "eq",
        "def": 5,
        "text": "もはや布切れ、防具？はぁ？ def+5",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "ふつうのマント",
        "type": "eq",
        "def": 14,
        "text": "マント。少しは守ってくれそう def+14",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "きれいなマント",
        "type": "eq",
        "def": 36,
        "text": "防刃性能ばっちり、衝撃にも強い高級品 def+32",
        "rarity": 3,
        "chip": ""
    },
    {
        "name": "でんせつのマント",
        "type": "eq",
        "def": 99,
        "text": "勇者が着てたとかなんとか、ふしぎな力で守られている def+99",
        "rarity": 5,
        "chip": ""
    },
    {
        "name": "ぶたにく",
        "type": "use",
        "hp": 10,
        "effect": "poison",
        "text": "生の豚肉。腹壊すよ HP10回復 毒付与",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "なまやけぶたにく",
        "type": "use",
        "hp": 25,
        "text": "生焼けの豚肉。美味しくはない HP25回復",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "こんがりぶたにく",
        "type": "use",
        "hp": 50,
        "text": "よく焼けた豚肉。あまりのおいしさに耐久アップ HP50回復 30ターンの間def+15",
        "rarity": 4,
        "effect": "def+15(30turn)",
        "chip": ""
    },
    {
        "name": "こげぶたにく",
        "type": "use",
        "hp": 10,
        "text": "こげた豚肉。まずい HP10回復",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "ぎゅうにく",
        "type": "use",
        "hp": 20,
        "text": "生の牛肉。腹壊すよ HP10回復 毒付与",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "なまやけぎゅうにく",
        "type": "use",
        "hp": 25,
        "text": "生焼けの牛肉。美味しくはない HP25回復",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "こんがりぎゅうにく",
        "type": "use",
        "hp": 50,
        "effect": "atk+15(30turn)",
        "text": "よく焼けた牛肉。あまりのおいしさに攻撃アップ HP50回復 30ターンの間atk+15",
        "rarity": 4,
        "chip": ""
    },
    {
        "name": "こげぎゅうにく",
        "type": "use",
        "hp": 10,
        "text": "こげた牛肉。まずい HP10回復",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "しあわせのクローバー",
        "type": "use",
        "effect": "3回回避",
        "text": "幸運の象徴。使えばいいことある…かも？",
        "rarity": 4,
        "chip": ""
    },
    {
        "name": "テレポストーン",
        "type": "use",
        "effect": "次エリア前に移動",
        "text": "移動の力を持った石 次への道となる",
        "rarity": 3,
        "chip": ""
    },
    {
        "name": "みなごろストーン",
        "type": "use",
        "effect": "同じエリアの敵を全滅させる",
        "text": "即死の力を持った石 尽くを薙ぎ払う",
        "rarity": 5,
        "chip": ""
    },
    {
        "name": "ヒールストーン",
        "type": "use",
        "effect": "全回復",
        "text": "治癒の力を持った石 全てを癒す",
        "rarity": 4,
        "chip": ""
    },
    {
        "name": "めくらまストーン",
        "type": "use",
        "effect": "同じ部屋の敵全員に暗闇",
        "text": "幻惑の力を持った石 逃げるもよし近づくもよし",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "ばくちストーン",
        "type": "use",
        "effect": "自分のHPが1/10になるか敵が死ぬか",
        "text": "博打の力を持った石 微笑むのは天使か悪魔か",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "バフストーン",
        "type": "use",
        "effect": "30ターンの間全ステータス1.5倍",
        "text": "補助の力を持った石 少しの間ステータスを強化する",
        "rarity": 4,
        "chip": ""
    },
    {
        "name": "ふっとばステッキ",
        "type": "use",
        "effect": "直線上の敵をふっとばす",
        "text": "不思議な棒。直線方向にいる敵を遠ざける",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "ステルスポーション",
        "type": "use",
        "effect": "30ターンの間気づかれない",
        "text": "隠形の力のこもったポーション 少しの間敵に見つからなくなる",
        "rarity": 3,
        "chip": ""
    },
    {
        "name": "リベンジポーション",
        "type": "use",
        "effect": "20ターンの間HPが1/5を下回ると全ステータス2倍",
        "text": "起死回生の力がこもったポージョン 弱っているときステータスが向上する",
        "rarity": 4,
        "chip": ""
    },
    {
        "name": "木の剣",
        "type": "eq",
        "atk": 3,
        "text": "ただの木剣 殴ると痛い atk+3",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "鉄の剣",
        "type": "eq",
        "atk": 26,
        "text": "鍛えられた鉄の剣 そこそこの切れ味 atk+26",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "ダイヤの剣",
        "type": "eq",
        "atk": 43,
        "text": "めっちゃ固いダイヤの剣 切れ味ばつぐん atk+43",
        "rarity": 4,
        "chip": ""
    },
    {
        "name": "えくすかりばー",
        "type": "eq",
        "atk": 78,
        "text": "でんせつの剣 ビームが出る atk+78",
        "rarity": 5,
        "effect": "直線方向にいる敵全体に攻撃可能",
        "chip": ""
    },
    {
        "name": "木の槍",
        "type": "eq",
        "atk": 2,
        "text": "ただの木の槍 ちょい範囲が広い atk+2",
        "rarity": 1,
        "effect": "2マス攻撃",
        "chip": ""
    },
    {
        "name": "鉄の槍",
        "type": "eq",
        "atk": 24,
        "text": "鍛えられた鉄の槍 刺されると痛い atk+24",
        "rarity": 2,
        "effect": "2マス攻撃",
        "chip": ""
    },
    {
        "name": "ダイヤの槍",
        "type": "eq",
        "atk": 42,
        "text": "燃やされるのに弱いダイヤの槍 威力は折り紙つき atk+42",
        "rarity": 4,
        "effect": "2マス攻撃",
        "chip": ""
    },
    {
        "name": "ぐんぐにる",
        "type": "eq",
        "atk": 81,
        "text": "神の王が使ったという槍 逃がさない atk+81",
        "rarity": 5,
        "effect": "2マス攻撃, 必中",
        "chip": ""
    },
    {
        "name": "うさぎにく",
        "type": "use",
        "hp": 10,
        "effect": "毒",
        "text": "生のうさぎ肉。腹壊すよ HP10回復 毒付与",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "ばにく",
        "type": "use",
        "hp": 10,
        "effect": "毒",
        "text": "生の馬肉。腹壊すよ HP10回復 毒付与",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "しかにく",
        "type": "use",
        "hp": 10,
        "effect": "毒",
        "text": "生の鹿肉。腹壊すよ HP10回復 毒付与",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "ししにく",
        "type": "use",
        "hp": 10,
        "effect": "毒",
        "text": "生の猪肉。腹壊すよ HP10回復 毒付与",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "くまにく",
        "type": "use",
        "hp": 10,
        "effect": "毒",
        "text": "生の熊肉。腹壊すよ HP10回復 毒付与",
        "rarity": 3,
        "chip": ""
    },
    {
        "name": "なまやけうさにく",
        "type": "use",
        "hp": 25,
        "text": "生焼けのうさぎ肉。美味しくはない HP25回復",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "こんがりうさにく",
        "type": "use",
        "hp": 50,
        "text": "よく焼けたうさぎ肉。あまりのおいしさに攻撃アップ HP50回復 30ターンの間def+15",
        "rarity": 4,
        "effect": "atk+15(30turn)",
        "chip": ""
    },
    {
        "name": "こげうさにく",
        "type": "use",
        "hp": 10,
        "text": "こげたうさぎ肉。まずい HP10回復",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "なまやけばにく",
        "type": "use",
        "hp": 25,
        "text": "生焼けの馬肉。美味しくはない HP25回復",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "こんがりばにく",
        "type": "use",
        "hp": 50,
        "text": "よく焼けた馬肉。あまりのおいしさに攻撃アップ HP50回復 30ターンの間def+15",
        "rarity": 4,
        "effect": "atk+15(30turn)",
        "chip": ""
    },
    {
        "name": "こげばにく",
        "type": "use",
        "hp": 10,
        "text": "こげた馬肉。まずい HP10回復",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "なまやけしかにく",
        "type": "use",
        "hp": 25,
        "text": "生焼けの鹿肉。美味しくはない HP25回復",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "こんがりしかにく",
        "type": "use",
        "hp": 50,
        "text": "よく焼けた鹿肉。あまりのおいしさに攻撃アップ HP50回復 30ターンの間def+15",
        "rarity": 4,
        "effect": "atk+15(30turn)",
        "chip": ""
    },
    {
        "name": "こげしかにく",
        "type": "use",
        "hp": 10,
        "text": "こげた鹿肉。まずい HP10回復",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "なまやけししにく",
        "type": "use",
        "hp": 25,
        "text": "生焼けの猪肉。美味しくはない HP25回復",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "こんがりししにく",
        "type": "use",
        "hp": 50,
        "text": "よく焼けた猪肉。あまりのおいしさに攻撃アップ HP50回復 30ターンの間def+15",
        "rarity": 4,
        "effect": "atk+15(30turn)",
        "chip": ""
    },
    {
        "name": "こげししにく",
        "type": "use",
        "hp": 10,
        "text": "こげた猪肉。まずい HP10回復",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "なまやけくまにく",
        "type": "use",
        "hp": 25,
        "text": "生焼けの熊肉。美味しくはない HP25回復",
        "rarity": 3,
        "chip": ""
    },
    {
        "name": "こんがりくまにく",
        "type": "use",
        "hp": 50,
        "text": "よく焼けた熊肉。あまりのおいしさに攻防アップ HP50回復 30ターンの間 atk,def+30",
        "rarity": 5,
        "effect": "atk+30(30turn),def+30(30turn)",
        "chip": ""
    },
    {
        "name": "こげくまにく",
        "type": "use",
        "hp": 10,
        "text": "こげた熊肉。まずい HP10回復",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "はちのこ",
        "type": "use",
        "hp": 20,
        "text": "蜂の子 好きな人は好き HP20回復",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "へびにく",
        "type": "use",
        "hp": 10,
        "text": "生の蛇肉。腹壊すよ HP10回復 毒付与",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "なまやけへびにく",
        "type": "use",
        "hp": 25,
        "text": "生焼けの蛇肉。美味しくはない HP25回復",
        "rarity": 2,
        "chip": ""
    },
    {
        "name": "こんがりへびにく",
        "type": "use",
        "hp": 50,
        "text": "よく焼けた蛇肉。あまりのおいしさに防アップ HP50回復 30ターンの間 def+20",
        "rarity": 4,
        "effect": "def+20(30turn)",
        "chip": ""
    },
    {
        "name": "こげへびにく",
        "type": "use",
        "hp": 10,
        "text": "こげた蛇肉。まずい HP10回復",
        "rarity": 1,
        "chip": ""
    },
    {
        "name": "いつかだれかのゆめ",
        "type": "use",
        "text": "夢破れ、ミミックに喰われた人々の思いの結晶 使用フロアにおいて全ステータス2倍 毎ターン10%回復",
        "effect": "使用フロア中全ステータス2倍+10%リジェネ",
        "rarity": 5,
        "chip": ""
    }

]