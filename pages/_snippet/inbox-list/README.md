# inbox-list の使い方

## 1.HTML

以下のHTMLを前提に作られています。  
キャプション（テキスト）や、コメントで書いてある部分は変更を加えても大丈夫ですが、  
HTMLの構造やclass属性を変更しないで使用してください。（スタイルが崩れる可能性があります。）

```XML
<div class="inbox-list">
	<div class="inbox-list-items">
		<div class="inbox-list-title">
			<div>
				<span class="">InboxList</span>
			</div>
		</div>
		<div class="inbox-list-tools">
			<ul id="dropdown-menu" class="dropdown-menu filtering-items"
				role="menu">
				<li><a id="menu-item1" class="item-1" href="#">メニュー1</a></li>
				<li><a id="menu-item2" class="item-1" href="#">メニュー2</a></li>
			</ul>
			<button type="button" class="btn btn-primary bg-color-primary dropdown-btn data-toggle="dropdown" tabindex="-1">
				<span>ボタンメニュー</span>
				<i class="wap-icon-caret-down"></i>
			</button>
		</div>	
	</div>
	<div class="inbox-list-content">
	    <div class="inbox-list-content-list before-detail-part">
	    	<!-- ヘッダー行です。不要な場合はこのノードを削除してOKです。 -->
			<div class="inbox-list-content-list-row-header">
				<div class="title-column">名称</div>
				<div class="amount-column">金額</div>
				<div class="img-column">担当者</div>
				<div class="person-column"></div>
				<div class="padding-column"></div>
				<div class="action-icons-column"></div>
			</div>
			{{#inboxList}}
			<div class="inbox-list-content-list-row" data-val="{{id}}" data-url="{{url}}">
		    	<!-- 各列のテンプレートです。不要列を消したり、class属性などを変えてOKです。 -->
				<div class="title-column"><span>{{title}}</span></div>
				<div class="amount-column"><span>{{amount}}</span></div>
				<div class="img-column"><img class="img-48 img-circle" src="{{imgPath}}"></div>
				<div class="person-column"><span>{{person}}</span></div>
				<div class="padding-column"></div>
		    	<!-- action-icons-columnはアクションボタンを表示する部分です。ここを消すとアクションボタンが表示されなくなります。 -->
				<div class="action-icons-column">
					<div class="background"></div>
					<i class="wap-icon-ellipsis-v"></i>
				</div>
			</div>
			{{/inboxList}}
		</div>
		
		<div class="inbox-list-content-list after-detail-part">
		</div>
	</div>
	
	<!-- action-icons-columnを押したときに表示されるアクションメニューです。 -->
	<div class="action-menu">
		<div id="action-menu-1" class="action-menu-item">
			<span>Inboxアクション1</span>
		</div>
		<div id="action-menu-2" class="action-menu-item">
			<span>Inboxアクション2</span>
		</div>
		<div id="action-menu-3" class="action-menu-item">
			<span>Inboxアクション3</span>
		</div>					
		<div id="action-menu-4" class="action-menu-item">
			<span>Inboxアクション4</span>
		</div>
		<div id="action-menu-5" class="action-menu-item">
			<span>Inboxアクション5</span>
		</div>
	</div>
</div>
```

## 2.json

以下のような構造のjsonを受け取る前提で作られています。

```Javascript
{
  "inboxList":[
    {"id":"1","title":"一行目","url":"../_snippet/inbox-list/inbox-list-expand-detail.html","amount":"¥ 1,700","imgPath":"../../common/images/user/4862.jpg","person":"上田 英二"},
    {"id":"2","title":"二行目","url":"../_snippet/inbox-list/inbox-list-expand-detail.html","amount":"¥ 5,200","imgPath":"../../common/images/user/5349.jpg","person":"木下 順"},
    {"id":"3","title":"三行目","url":"../_snippet/inbox-list/inbox-list-expand-detail.html","amount":"¥ 8,300","imgPath":"../../common/images/user/4842.jpg","person":"真下 健太"},
    {"id":"4","title":"四行目","url":"../_snippet/inbox-list/inbox-list-expand-detail.html","amount":"¥ 6,100","imgPath":"../../common/images/user/5349.jpg","person":"木下 順"}
  ]
}
```
#### jsonの各プロパティについて
- inboxList　・・・　各行にバインドするオブジェクト
- id　・・・　各行を識別する値、行がクリックされたときのイベントデータに含まれる
- url　・・・　inbox-listがexpandモード（クリックすると行が拡大して明細が表示される形式）のときに表示される、詳細のHTMLのパス
- title,amount,imgPath,person　・・・　データを表示するためにバインドする値、HTMLに合わせてここの値は変わる

#### 動作の概要

##### アクションボタン
各行にホバーすると、右側にアクションボタンが表示されます。  
アクションボタンをクリックすると、 `action-menu` が表示される  

##### 行をクリックしたとき
コンストラクタ―で第一引数に渡した値によって動作が変わります。  
`true` を渡すと、expandモードになります。  
expandモードは、画面遷移をせずに、クリックされた行が縦に広がって詳細が表示されるような動作をします。  
  
`false` を渡す、もしくは何も渡さなかった場合は、 `InboxList.EventType.ROW_SELECTED` イベントが発火されます。  
このイベントをキャッチして、ページ遷移がされるのを想定しています。  


## 3.Javascript

`inbox-list.js` と `inbox-behavior.js` を読み込んで、以下のように初期化してください。

```Javascript
// コンストラクタ―でやる
// trueを渡すとexpandモード（クリックすると行が拡大して明細が表示される形式）になる
// falseを渡す、もしくは何も渡さない場合は、 `InboxList.EventType.ROW_SELECTED` が発火する
this.inboxList_ = new InboxList(true);

// enterDocument内でやる
// 第一引数に、inbox-listの親ノードclassを渡す（渡さない場合はdocument.bodyになる）
// inbox-listを同一画面内に2つ以上使用する場合はそれぞれ指定する必要がある
this.inboxList_.enterDocument('.inbox-list-parent-container');
```

破棄する場合は以下のようにしてください。

```Javascript
// exitDocument内でやる
this.inboxList_.exitDocument();
```

## 4.CSS

`inbox-list.css` を読み込んでください。


## 5.動作イメージ

