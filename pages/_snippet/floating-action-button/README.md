# floating-action-button の使い方

floating-action-buttonは管理系画面(Portal)の右下にある、新規申請書を作る際などに利用するボタンのことです。

## 1.HTML

floating-action-buttonを置きたいhtmlにfloating-action-button.htmlの中身をコピーして記載して下さい。


## 2.json

以下のような構造のjsonを受け取る前提で作られています。

```Javascript
{
	"mainBall":{"text":"ファイルアップロード","icon":"plus","hoverIcon":"file-upload","id":"new-application"},
	"childBall":[
		{"text":"新規作成","icon":"plus","id":"new-application-child-1","colorClass":"lightblue"},
		{"text":"ファイル","icon":"file","id":"new-application-child-2","colorClass":"indigo"},
		{"text":"ダウンロード","icon":"download","id":"new-application-child-3","colorClass":"green"}
	]
}
```
#### jsonの各プロパティについて
- mainBall　・・・　右下に表示されるボタンのプロパティを保持
- text　・・・　Hoverした際に表示されるヒントのtext
- icon　・・・　表示されるicon
- id　・・・　各ボタンに付与されるid
- childBall　・・・　mainBallにHoverした際に表示される、childBallのプロパティを保持
- colorClass　・・・　ボタンのcolor [white,default,info,success,warning,danger,indigo,green,red,lightblue,orange]が指定可能

## 3.Javascript
ありません。
各ボタンがクリックされた際のEventは各ページで定義して下さい。


## 4.CSS

`floating-action-button.css` を読み込んでください。


## 5.動作イメージ

