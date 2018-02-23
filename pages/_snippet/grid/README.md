# grid-builder を使った grid の作り方

## 1.HTML

gridは以下のように、高さと幅が指定されたHTMLに描画される想定で作られています。

```XML
<!-- 本来であれば、style はHTMLではなく、CSSで指定するべき -->
<div class="grid-container" style="height:500px; width:900px;">
</div>
```

また、以下のscriptタグを必要とします。
```XML
<script src="../../common/lib/Datejs-all/build/date-ja-JP.js"></script>
<script src="../../common/lib/typeahead.js/bloodhound-customized.js"></script>
<script src="../../common/lib/typeahead.js/typeahead-customized.jquery.js"></script>
<script src="../../common/lib/closure-library/closure/goog/base.js"></script>
<script src="../../common/deps.js"></script>
<script type="text/javascript">goog.require('wap.fw.ui.SlickGrid.Grid');</script>
<!-- このほかにも、プラグインやエディターを追加する場合は、HTMLに直接scriptタグを書きます -->
```


## 2.json

grid-builderは、以下の3つのjsonを受け取ることができます。
・グリッドのカラム定義 [column-def.json]（必須）
・グリッドの設定 [grid-option.json]（任意）
・グリッドの初期表示データ [initial-data.json]（任意）

**[column-def.json]の例**
```Javascript
[
  {
    "id":"rowno",
    "isId":true,
    "field":"rowno",
    "width":45,
    "align":"center",
    "focusable":false,
    "formatter":[
      "RowNumber"
    ],
    "cssClass":"text-light"
  },{
    "id":"name",
    "field":"name",
    "name":"品名",
    "width":200,
    "editor":"wap.fw.uiMock.input.TextInputSearch",
    "editorOptions" : {
      "typeaheadSettings" : {
        "dropdownContainer" : "body"
      }
    },
    "formatter":[
      {"Placeholder":"品名、型番、分類"}
    ]
  },{
    "id":"division",
    "field":"division",
    "name":"品目分類",
    "width":200,
    "editor":"wap.fw.uiMock.input.TextInputSearch",
    "editorOptions" : {
      "typeaheadSettings" : {
        "dropdownContainer" : "body"
      }
    },
    "formatter":[
      {"Placeholder":"例）事務用品、PC部品"}
    ]
  },{
    "id":"desired_quantity",
    "field":"desired_quantity",
    "name":"希望数量",
    "width":100,
    "align":"right",
    "editor":"wap.fw.uiMock.input.NumericInput",
    "formatter":[
      "NumberRound",{"Placeholder":"0"}
    ]
  },{
    "id":"unit",
    "field":"unit",
    "name":"単位",
    "width":80,
    "editor":"wap.fw.uiMock.input.TextInputSearch",
    "editorOptions" : {
      "typeaheadSettings" : {
        "dropdownContainer" : "body"
      }
    },
    "formatter":[
      {"Placeholder":"例）個"}
    ]
  },{
    "id":"due_date",
    "field":"due_date",
    "name":"希望納期",
    "width":160,
    "editor":"wap.fw.ui.input.TextInput",
    "formatter":[
      {"Placeholder":"例）0901, 9/1"}
    ]
  },{
    "id":"delivery_condition",
    "field":"delivery_condition",
    "name":"備考",
    "width":410,
    "editor":"wap.fw.ui.input.TextInput",
    "formatter":[
      {"Placeholder":"その他の記載事項はここに書いてください"}
    ]
  },{
    "id":"switch",
    "field":"switch",
    "name":"代替品可",
    "width":120,
    "editor":"wap.fw.ui.SlickGrid.ToggleIcon",
    "formatter":[{
      "ToggleIcon":{
          "off": {"value": 0, "icon": "toggle-icon-off"},
          "on" : {"value": 1, "icon": "toggle-icon-on"}
      }
    }]
  }
]
```

**[grid-option.json]の例**
```Javascript
{
  "width" : "100%",
  "height" : "100%",
  "editable" : true,
  "enableAddRow" : false,
  "plugins" : [
    "wap.fw.ui.SlickGrid.CellRangeSelector",
    "wap.fw.ui.SlickGrid.KeyOperation",
    "wap.fw.ui.SlickGrid.AutoFiller"
  ]
}
```

**[initial-data.json]の例**
```Javascript
[
  {"rowno":"1"},
  {"rowno":"2"},
  {"rowno":"3"},
  {"rowno":"4"},
  {"rowno":"5"}
]
```

## 3.Javascript

`grid-builder.js` を読み込んで、以下のように初期化してください。

```Javascript
 new GridBuilder()
        .columnPath('./json/column-def.json')
        .optionPath('./json/grid-option.json')
        .dataPath('./json/initial-data.json')
        .build($('.grid-container')).then(function(grid) {
          // do something (e.g. event binding)
        });
```

## 4.CSS

`grid.css` を読み込んでください。

## 5. プラグインやエディターの追加について

slickgridに対応しているプラグインやエディターは、slickgrid本体から依存性が切り離されています。  
そのため、それらを利用する場合は依存を自分で追加してあげる必要があります。  

例えば、[column-def.json]では、いくつかエディターが指定されています。  
そのため、HTMLには以下のscriptタグを追加してあげる必要があります。

```XML
<script type="text/javascript">goog.require('wap.fw.uiMock.input.TextInputSearch');</script>
<script type="text/javascript">goog.require('wap.fw.uiMock.input.NumericInput');</script>
<script type="text/javascript">goog.require('wap.fw.uiMock.input.DatePicker');</script>
<script type="text/javascript">goog.require('wap.fw.ui.SlickGrid.ToggleIcon');</script>
```

また、[grid-option.json]では、プラグインが3つ追加されています。  
そのため、HTMLには以下のscriptタグを追加してあげる必要があります。

```XML
<script type="text/javascript">goog.require('wap.fw.ui.SlickGrid.CellRangeSelector');</script>
<script type="text/javascript">goog.require('wap.fw.ui.SlickGrid.KeyOperation');</script>
<script type="text/javascript">goog.require('wap.fw.ui.SlickGrid.AutoFiller');</script>
```

## 6. TextInputSearchエディターへのサジェストデータの注入について

slickgridにはオートコンプリート付きのエディターが用意されており、それが `TextInputSearch` です。  
grid-builderは、 `TextInputSearch` にサジェストデータを注入する機構を用意しています。

```Javascript
 new GridBuilder()
        .columnPath('./json/column-def.json')
        .optionPath('./json/grid-option.json')
        .dataPath('./json/initial-data.json')
        // 第一引数にはサジェストする対象のカラムID、第二引数にはサジェストデータのjsonのパスを渡す
        .injectSuggestionData('name', 'json/autocomplete/goods-suggest-data.json')
        // 第三引数には、サジェストのHTMLレイアウトを変更する関数を渡すことができます
        .injectSuggestionData('division', 'json/autocomplete/category-suggest-data.json', function(datum) {
          return '<span class="suggestion-value">' + datum['word'] + '</span><span class="suggest-category-tree">' + datum['path'] + '</span>';
        })
        .build($('.grid-container')).then(function(grid) {
          // do something (e.g. event binding)
        });
```

上記サジェストデータの中身は、以下のようになっています。

**[goods-suggest-data.json]**
```Javascript
[
  {"word":"温度センサー 熱電対Kタイプ（シースタイプ）", "input":"onndosensa おｎ おんｄ おんどｓ"},
  {"word":"オイレス ドライメットLF ブッシュ (LFB)", "input":"oiresu おいｒ おいれｓ"},
  {"word":"オイラー", "input":"oira おいｒ おいらー"},
  {"word":"オイルバス耐熱シリコーンオイル(オイルバス用）", "input":"oiru おいｒ おいる"},
  {"word":"オイルチェンジャー", "input":"oiru おいｒ おいる"},
  {"word":"オイルチャージャー（流量計付）", "input":"oiru おいｒ おいる"},
  {"word":"オイルシールプーラー","input":"oiru おいｒ おいる"},
  {"word":"オイルフィルターレンチ", "input":"oiru おいｒ おいる"},
  {"word":"シリコーンオイル 5-1010", "input":"oiru おいｒ おいる"},
  {"word": "カップリングツール", "input": "kappuringu ｋ かｐｐ かっぷｒ かっぷりｎ かっぷりんｇ"},
  {"word": "タイロッドエンドプーラー", "input": "tairoddo ｔ たいｒ たいろｄｄ たいろっどえｎ たいろっどえんどｐ"},
  {"word": "ジャッキアップソケット２つ爪", "input": "jakkiappu zyakkiappu ｊ じゃｋｋ じゃっきあｐｐ"},
  {"word": "ワンマンブリーダータンク", "input": "wanman ｗ わｎ わんｍ わんまｎ わんまんｂ tanku ｔ たｎ たんく"},
  {"word": "ロック式 キャリパーピストンツール", "input": "rokkusiki ｒ ろｋｋ ろっくｓ ろっくしｋ ｋ ｋｙ きゃｒ きゃりｐ きゃりぱー pisuton ｐ ぴｓ ぴすｔ ぴすとｎ ぴすとん"}
]
```

**[category-suggest-data.json]**
```Javascript
[
  {"word":"鉄鋼","path":"原材料 > 金属材料 > 鉄鋼","input":"きんぞくざいりょう てっこう kinzoku kinnzoku ｋ きｎ きんｚ tekkou ｔ てｋｋ"},
  {"word":"合金","path":"原材料 > 金属材料 > 合金","input":"きんぞくざいりょう ごうきん kinzoku kinnzoku ｋ きｎ きんｚ goukinn ｇ ごうｋ ごうきｎ"},
  {"word":"特殊鋼","path":"原材料 > 金属材料 > 特殊鋼","input":"きんぞくざいりょう とくしゅはがね kinzoku kinnzoku ｋ きｎ きんｚ tokusyuhagane ｔ とｋ とくｓｙ とくしゅｈ とくしゅはｇ とくしゅはがｎ"},
  {"word":"非鉄金属","path":"原材料 > 金属材料 > 非鉄金属","input":"きんぞくざいりょう ひてつきんぞく kinzoku kinnzoku ｋ きｎ きんｚ hitetsu hitetu ｈ ひｔ ひてｔｓ"},
  {"word":"洗浄剤","path":"生産加工用品 > 化学製品 > 洗浄品","input":"せいさんかこうひん かがくせいひん せんじょうひん seisankakou seisannkakou ｓ せいｓ せいさｎ せいさんｋ せいさんかｋ kagaku ｋ かｇ かがｋ senjouhin sennzyouhinn ｓ せｎ せんｊ せんｚｙ"},
  {"word":"ステンレス","path":"原材料 > 金属材料 > ステンレス","input":"きんぞくざいりょう すてんれす kinzoku kinnzoku ｋ きｎ きんｚ sutenresu sutennresu ｓ すｔ すてｎ すてんｒ すてんれｓ"},
  {"word":"アルミニウム","path":"原材料 > 金属材料 > アルミニウム","input":"きんぞくざいりょう あるみにうむ kinzoku kinnzoku ｋ きｎ きんｚ aruminiumu あｒ あるｍ あるみｎ あるみにうｍ"},
  {"word":"レアメタル","path":"原材料 > 金属材料 > レアメタル","input":"きんぞくざいりょう れあめたる kinzoku kinnzoku ｋ きｎ きんｚ reametaru raremetal ｒ れあｍ れあめｔ れあめたｒ"},
  {"word":"磁石","path":"原材料 > 金属材料 > 磁石","input":"きんぞくざいりょう じしゃく kinzoku kinnzoku ｋ きｎ きんｚ jisyaku zisyaku ｚ ｊ じｓｙ じしゃｋ"},
  {"word":"はんだ","path":"原材料 > 金属材料 > はんだ","input":"きんぞくざいりょう はんだ kinzoku kinnzoku ｋ きｎ きんｚ handa ｈ はｎ はんｄ"},
  {"word":"プラスチック","path":"原材料 > 高分子材料 > プラスチック","input":"こうぶんしざいりょう ぷらすちっく koubunsi koubunnshi ｋ こうｂ こうぶｎ こうぶんｓ purasutikku purasuchikku ｐ ぷｒ ぷらｓ ぷらすｔ ぷらすｃｈ ぷらすちｋｋ plastic"},
  {"word":"エンジニアリングプラスチック","path":"原材料 > 高分子材料 > エンジニアリングプラスチック","input":"こうぶんしざいりょう えんじにありんぐぷらすちっく koubunsi koubunnshi ｋ こうｂ こうぶｎ こうぶんｓ enjiniaringu enziniaring えｎ えんｊ えんｚ えんじｎ えんじにあｒ えんじにありｎ えんじにありんｇ"},
  {"word":"ゴム","path":"原材料 > 高分子材料 > ゴム","input":"こうぶんしざいりょう ごむ koubunsi koubunnshi ｋ こうｂ こうぶｎ こうぶんｓ gomu ｇ ごｍ"},
  {"word":"繊維","path":"原材料 > 高分子材料 > 繊維","input":"こうぶんしざいりょう せんい koubunsi koubunnshi ｋ こうｂ こうぶｎ こうぶんｓ senni ｓ せｎ"},
  {"word":"複合材料","path":"原材料 > 高分子材料 > 複合材料","input":"こうぶんしざいりょう ふくごうざいりょう koubunsi koubunnshi ｋ こうｂ こうぶｎ こうぶんｓ fukugouzairyou ｆ ふｋ ふくｇ ふくごうｚ ふくごうざいｒｙ"}
]
```
