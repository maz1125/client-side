# talk-widget の使い方

## 1.HTML

talk-widgetはwidgetエリアの中に描画される想定で作られています。

```XML
<div class="widget-area">
</div>
```

## 2.json

以下のような構造のjsonを受け取る前提で作られています。

```Javascript
{
  "talks":[{
    "date":"2016-12-19",
    "contents":[
      {"isMe":true,
       "comment":"`talks`は初期状態で表示されるコメントたちです。`isMe`をtrueにすると、自分の投稿になります。"
      }
    ]
  },{
    "date":"2016-12-20",
    "contents":[
      {"isMe":false,
       "name":"安住 昭信",
       "img":"../../common/images/user/0782.jpg",
       "comment":"`isMe`をfalseにすると、他の人の投稿になります。`name`と`img`の指定が必要です。"
      }
    ]
  }],
  "listeners":[{
      "triggerLength": 2,
      "delaySeconds": 5,
      "content":{
        "name":"藤井 淳",
        "img":"../../common/images/user/10037.jpg",
        "comment":"`listeners`は、他の人が新たにコメントを投稿したのを疑似的に再現するものです。表示されているコメント数が`triggerLength`以上になったら、`delaySeconds`秒後にコメントが投稿されます。"
      }
    },{
      "triggerLength": 2,
      "delaySeconds": 6,
      "content":{
        "name":"藤井 淳",
        "img":"../../common/images/user/10037.jpg",
        "comment":"`triggerLength`が5のデータも登録されているので、試しに1つコメントを投稿してみてください。あなたが投稿した3秒後に新しいコメントが投稿されます。"
      }
    },{
      "triggerLength": 5,
      "delaySeconds": 3,
      "content":{
        "name":"池内 善一",
        "img":"../../common/images/user/10014.jpg",
        "comment":"あなたの投稿により、このコメントが投稿されました。"
      }
    }
  ],
  "numOfRoom":4,
  "readTimingMinSec":10,
  "readTimingMaxSec":30
}
```
#### jsonの各プロパティについて
- talks　・・・　初期描画時に表示されるトークのコメント群
- date　・・・　トークが投稿されたとする日付
- contents　・・・　トークの内容群
- isMe　・・・　自分の投稿か他のユーザーの投稿か
- name　・・・　（他のユーザーの投稿の場合）投稿したユーザーの名前
- img　・・・　（他のユーザーの投稿の場合）投稿したユーザーの画像のパス
- comment　・・・　コメントの内容
- listeners　・・・　描画後に時間差で表示されるトークのコメント群
- triggerLength　・・・　トークがいくつになったら当該コメントが表示されるか
- delaySeconds　・・・　トークがtriggerLengthに達したあと何秒後に表示するか
- numOfRoom　・・・　トークの中にいるユーザー数、既読が付く件数に影響する（指定がない場合は2）
- readTimingMinSec　・・・　最初の既読が付くまでの秒数（指定がない場合は5秒後）
- readTimingMaxSec　・・・　最後の既読が付くまでの秒数（指定がない場合は5秒後）

#### 動作の概要

##### 他のユーザーからの疑似的な返信について
他のユーザーからの疑似的な返信は、 `listeners` に基づいておこなわれます。  
疑似的な返信をおこなうかどうかを判断するタイミングは、初期描画時およびコメントが増えたときです。  
現在のコメント数と各listenerの `triggerLength` を比較して、現在のコメント数が `trigerLength`以上だった場合に疑似的な返信が予約されます。  
返信の予約がされてから `delaySeconds` 秒後に、疑似的な返信が投稿されます。

##### 既読について
まず、既読で表示される人数の最大値は `numOfRoom` -1 です。  
コメントが投稿されたあとに、`numOfRoom` -1 件数分の既読をつける予約がされます。  
実際に既読が付くタイミングについては、自分の投稿か他のユーザーの投稿かによって若干動作が変わります。  
自分の投稿の場合、一番最初に既読が付くタイミングは `readTimingMinSec` 秒後です。  
一番最後に既読が付くタイミングは `readTimingMaxSec` 秒後です。  
既読の予約の件数が3件以上の場合は、 `readTimingMinSec` と `readTimingMaxSec` の間でランダムに既読が付きます。  
他のユーザーの投稿の場合、最初の既読は自分になるため、既読1件が即時に付きます。  
2件目以降は自分の投稿の場合と同様に `readTimingMinSec` と `readTimingMaxSec` を加味して既読が付いていきます。  

## 3.Javascript

`talk-widget.js` を読み込んで、以下のように初期化してください。

```Javascript
var talkWidget = new TalkWidget();
// 第一引数にはtalk-widgetを描画するコンテナ、第二引数には2で用意したjsonファイルが置いてあるパスを指定
talkWidget.render($('.widget-area'), '../json/talk-widget.json');
```

## 4.CSS

`talk-widget.css` を読み込んでください。


## 5.動作イメージ
