# modal-dialog の使い方

## 1.HTML
Dialogの中に表示したいhtmlをmodal-dialog-contents.htmlを基に準備して下さい。

```XML
<!DOCTYPE html>
<meta charset="utf-8">
<div>
	<div class="dialog-contents-top">
		<div class="modal-header">
			<i class="wap-icon-cancel dialog-header-cancel-icon pull-right" data-dismiss="modal" aria-hidden="true"></i>
			<div class="clearfix">
				<div class="sh-title">
					<div class="modal-title font-size-ll">{{dialogTitle}}</div>
				</div>
			</div>
		</div>
		<div class="modal-body">
			<!-- HeaderLabelが不要であれば消してください -->
			<div class="dialog-header-label">
				<span class="header-label-value">{{headerLabel}}</span>
			</div>
			<div class="dialog-contents-body">
				<!-- Dialogの中身をここに書く  -->
			</div>					
		</div>
		<div class="modal-footer">
			<button type="button" id="submit" class="btn btn-primary">{{primaryButtonLabel}}</button>
			<button type="button" class="btn btn-default" data-dismiss="modal">{{defaultButtonLabel}}</button>
		</div>
	</div>
</div>
```

## 2.json

Dialogの中身に、下記のようなjsonを渡すことが出来ます。

```Javascript
{
"dialogTitle":"Dialogのタイトルをここに記載して下さい",
"headerLabel":"HeaderLabelがあればここに記載して下さい",
"primaryButtonLabel":"確定",
"defaultButtonLabel":"キャンセル"
}
```

## 3.Javascript
### 読み込み
`modal-dialog.js` を読み込んでください。

### イベント
ModalDialogは以下のイベントを発火します。
- ModalDialog.EventType.SUBMIT
ModalDialog内にあるprimaryButtonを押したときに発火します。
「Dialog内での処理が完了し閉じた」というイベントをバインドすることを想定しています。


## 4.CSS

`modal-dialog.css` を読み込んでください。

## 5.描画

Dialogを描画させたいEventで実行されるメソッド内で下記のように初期化して下さい。

```Javascript
    new ModalDialog()
      .htmlPath('template/modal-dialog-contents.html')
      .jsonPath('json/modal-dialog.json') //任意
      .size(ModalDialog.Size.SMALL) //任意
      .build().then(function(dialog){
      	// Dialog内のPrimaryButtonを押した際のEventは下記のようにListenすることができます
        // dialog.on(ModalDialog.EventType.SUBMIT,this.closeDialog_.bind(this));
      }.bind(this));
  };
```


## 6.オプション

### 6-1.size
サイズは、下記の4種類が用意されています。
初期化時に値を渡すことでサイズの変更ができます(渡さない場合はMIDDLEサイズになります)
- SMALL
- MIDDLE
- LARGE
- XLARGE


## 7.動作イメージ
