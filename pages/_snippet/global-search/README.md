# global-search の使い方

## 1.HTML

以下のHTMLを前提に作られています。  
HTMLの構造やclass属性を変更しないで使用してください。（class属性の追加はOK）  

```XML
<div class="global-search">
    <button class="back-btn btn btn-default wap-icon-arrow-left">戻る</button>
        <div class="search-input-area">
        <input class="search-input" type="text" placeholder="検索キーワードを入力してください　例) 申請書の種類、申請者、申請番号" />
        <button class="wap-icon-search search-btn btn btn-primary"></button>
    </div>
</div>
```

## 2.json

以下のような構造のjsonを受け取る前提で作られています。

```Javascript
{
  "dictionary":[
    {"word":"経費","input":["けいひ","ｋ","けいｈ","keihi"]},
    {"word":"交通費精算","input":["こうつうひせいさん","ｋ","こうｔ","こうｔｓ","こうつうｈ","koutuhiseisan","koutsuhiseisan"]},
    {"word":"国内出張精算","input":["こくないしゅっちょうせいさん","ｋ","こｋ","こくｎ","こくないｓ","こくないｓｙ","こくないしゅｔｔｙ","こくないしゅｃｃｈ","kokunaisyuttyouseisan","kokunaisyucchyouseisan"]},
    {"word":"海外出張精算","input":["かいがいしゅっちょうせいさん","ｋ","かいｇ","かいがいｓｙ","かいがいしゅｔｔｙ","かいがいしゅｃｃｈ","kaigaisyuttyouseisan","kaigaisyucchyouseisan"]}
  ],

  "searchResult":[
    {"text":"経費","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/expense.json"},
    {"text":"経費 交通費精算","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/transportation.json"},
    {"text":"経費 交通費精算 未承認","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/transportation_unapproved.json"},
    {"text":"経費 交通費精算 先月","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/transportation.json"},
    {"text":"経費 国内出張精算","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/domestic-biz-trip.json"},
    {"text":"経費 国内出張精算 未承認","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/domestic-biz-trip_unapproved.json"},
    {"text":"経費 国内出張精算 先月","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/domestic-biz-trip.json"},
    {"text":"経費 海外出張精算","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/overseas-biz-trip.json"},
    {"text":"経費 海外出張精算 未承認","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/overseas-biz-trip.json"},
    {"text":"経費 海外出張精算 先月","htmlPath":"template/globalsearch/approval.html"},
    {"text":"交通費精算","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/transportation.json"},
    {"text":"交通費精算 未承認","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/transportation_unapproved.json"},
    {"text":"交通費精算 先月","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/transportation.json"},
    {"text":"国内出張精算","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/domestic-biz-trip.json"},
    {"text":"国内出張精算 未承認","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/domestic-biz-trip_unapproved.json"},
    {"text":"国内出張精算 先月","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/domestic-biz-trip.json"},
    {"text":"海外出張精算","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/overseas-biz-trip.json"},
    {"text":"海外出張精算 未承認","htmlPath":"template/globalsearch/approval.html","jsonPath":"json/globalsearch/overseas-biz-trip.json"},
    {"text":"海外出張精算 先月","htmlPath":"template/globalsearch/approval.html"}
  ]
}
```
#### jsonの各プロパティについて
- dictionary　・・・　サジェストされる単語群
- word　・・・　サジェストされる単語
- input　・・・　inputの文字列のどれかに、入力されている文字列が一致した場合、wordがサジェストされる
- searchResult　・・・　サジェストから選択されたときに表示するページの情報
- text　・・・　最終的な検索結果の文字列
- htmlPath　・・・　検索結果のページのHTMLが配置してあるパス
- jsonPath　・・・　（HTMLがtemplateになっている場合）バインドしたいjsonデータ

#### 動作の概要

##### 最初の単語を入力しているとき
`dictionary` の単語の中からサジェストされます。  
入力中の文字列が、 `input` の文字列に「前方一致」した場合、その一致した `input` をもつ `word` がサジェストされます。  

##### 単語のあとにスペースを押したとき
`searchResult` から、次の単語がサジェストされます。  

サジェストのアルゴリズムは以下の通りです。  

まず、入力されている文字列と、 `serachResult` の `text` の文字列を前方一致するかどうかをみます。（半角・全角スペースは区別しない）  
前方一致する場合、 `searchResult` の `text` の中で前方一致しなかった部分を抽出します。  
その抽出した部分が一単語のみで構成されている場合、その `searchResult` の `text` をサジェストします。  

上記のjsonを例にした場合：  
「経費　」と打ったとき、前方一致する `searchResult` の `text` は、  

- 経費 交通費精算
- 経費 交通費精算 未承認
- 経費 交通費精算 先月
- 経費 国内出張精算
- 経費 国内出張精算 未承認
- 経費 国内出張精算 先月
- 経費 海外出張精算
- 経費 海外出張精算 未承認
- 経費 海外出張精算 先月

の9つ。  
そのうち、「経費　」の後が一単語で構成されているものは  

- 経費 交通費精算
- 経費 国内出張精算
- 経費 海外出張精算

の3つ。  
したがって、「経費　」と打った後には、この3つがサジェストされる。  


##### 単語のあとにスペースを押し、さらにそのあと文字を入力したとき
スペースを押した後にさらにタイピングを続けた場合、 `searchResult` に関係なく、再び `dictionary` からサジェストされます。  
ただし、最後のスペースより前の文字列は確定済みとみなしているので、最後のスペースより後の入力値をもとに `dictionary` からサジェストされます。  


## 3.Javascript

### 初期化

`global-search.js` を読み込んで、以下のように初期化してください。

```Javascript
// 第一引数には、2で用意したjsonファイルが置いてあるパスを指定
// （第二引数に数字を渡すと、サジェストで表示される行数を制御できます。デフォルトは8）
this.globalSearch_ = new GlobalSearch('json/global-search.json');
```search-result

### イベント

GlobalSearch は以下のイベントを発火します。

- __GlobalSearch.EventType.CHANGE_SEARCH_RESULT__  
検索候補をクリックしたときや、キーボードの上下キーで検索候補のカーソルを移動したとき、検索画面が変更したときに発火します。  
このイベントは、検索結果の画面が変わったときにその画面にイベントをバインドすることを想定して、検索画面が描画された直後のタイミングで投げています。  
このイベントのリスナー関数の第二引数には、どの検索候補が選ばれて検索画面が描画されたかを特定するための情報を渡しています。

    ```Javascript
    // 使用例
    this.globalSearch.getEventTarget().on(GlobalSearch.EventType.CHANGE_SEARCH_RESULT, function(e, searchResult) {
      console.log(searchResut.text); // 検索候補の文字列
      console.log(searchResut.htmlPath); // 検索候補の文字列が選ばれたときに検索画面に表示されるHTMLのパス（search-result.jsonで渡しているもの）
      console.log(searchResut.jsonPath); // 検索候補の文字列が選ばれたときに検索画面にバインドされるjsonのパス（search-result.jsonで渡しているもの）
    });
    ```

- __GlobalSearch.EventType.SEARCH_UNMATCH_WORD__  
検索候補がないときに、検索文字列を確定した場合（Enterを押した場合）に発火します。文字列が空の場合は発火しません。  
このイベントは、ヒットしない文字列で検索したときの動きを表現したい場合を想定して、検索が実行されたタイミングを通知する目的で投げています。  
このイベントのリスナー関数の第二引数には、検索時に検索バーに入力されていた文字列を渡しています。

    ```Javascript
    // 使用例
    this.globalSearch.getEventTarget().on(GlobalSearch.EventType.SEARCH_UNMATCH_WORD, function(e, inputtext) {
      console.log(inputtext); // 検索時の文字列
    });
    ```

## 4.CSS

`global-search.css` を読み込んでください。


## 5.動作イメージ
