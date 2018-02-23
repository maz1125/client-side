# approval-flow-diagram の使い方

## 1.HTML

以下のHTMLを前提に作られています。  
HTMLの構造やclass属性を変更しないで使用してください。（class属性の追加の変更はOK）

```XML
<div class="approval-flow-diagram">
    {{#approvalFlowDiagramModel}}
    <div class="flow-node coming">
        <div class="flow-node-header">{{stepCaption}}</div>
        <div class="flow-node-content">
            {{#actors}}
            <div class="flow-actor">
                <img class="img-48" src="{{actorImagePath}}">
                <div class="actor-description"><div class="actor-name">{{actorName}}</div><div class="actor-role font-size-s {{roleColor}}">{{actorRole}}</div></div>
            </div>
            {{/actors}}
        </div>
    </div>
    {{/approvalFlowDiagramModel}}
</div>
```

## 2.json

以下のような構造のjsonを受け取る前提で作られています。

```Javascript
{
  "approvalFlowDiagramModel":[
    {"stepCaption":"申請者","actors":[
        {"actorName":"斎藤 真緒","actorImagePath":"../../common/images/user/4734.jpg"}
    ]},
    {"stepCaption":"所長","actors":[
        {"actorName":"二見 悠里","actorRole":"本承認者","roleColor":"text-light","actorImagePath":"../../common/images/user/10013.jpg"},
        {"actorName":"加藤 克実","actorRole":"代理承認者","roleColor":"text-success","actorImagePath":"../../common/images/user/1012.jpg"}
    ]},
    {"stepCaption":"経理承認","actors":[
        {"actorName":"合田 桜子","actorRole":"本承認者","roleColor":"text-light","actorImagePath":"../../common/images/user/10063.jpg"}
    ]}
  ]
}
```
#### jsonの各プロパティについて
- approvalFlowDiagramModel　・・・　フローステップのデータ群
- stepCaption　・・・　各ステップのテキスト
- actors　・・・　ステップ内の登場人物
- actorName　・・・　登場人物の名前
- actorImagePath　・・・　登場人物のイメージ画像のパス
- actorRole　・・・　登場人物の役割のテキスト（無くても可）
- roleColor　・・・　役割のテキストのカラークラス（actorRoleがない場合は不要）



## 3.Javascript

#### HTMLの表示

特定のページに `approval-flow-diagram` が組み込まれている場合が多いと思うので、  
ScreenSwitcherに任せておけばいいです。  

内部的な処理は、以下のようなイメージです。

```Javascript
// 1で用意したHTMLファイルが置いてあるパス
var htmlPromise = ResourceLoader.loadHtml('template/approval-flow-diagram.html');
// 2で用意したjsonファイルが置いてあるパス
var jsonPromise = ResourceLoader.loadJson('json/approval-flow-diagram.json');

$.when(htmlPromise, jsonPromise).then(function(html, json) {
  var compiled = Hogan.compile(html).render(json);
  $('#some-contents').html(html);
});
```


`approval-flow-diagram.js` を読み込んで、以下のように初期化してください。

```Javascript
// 引数には、現在のステップ数を渡す
this.approvalFlowDiagram_ = new ApprovalFlowDiagram(2);

// 後から現在のステップを変更することもできます
this.approvalFlowDiagram_.changeCurrentStep(3);
```

## 4.CSS

`approval-flow-diagram.css` を読み込んでください。


## 5.画面イメージ

https://hue.workslan/owncloud/index.php/apps/files/?dir=%2F1.HUE%2Fteam%2FSCM%2FProcurement%2FConcept%2Fsnippet_introduction#  
approval-flow-diagram.png  
をご覧ください。