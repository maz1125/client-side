# file-import-socket の使い方

**file-import-socket** は、ファイルをドラッグ＆ドロップするときのUI・振る舞いをサポートします。

## 1.HTML

file-import-socketは、任意の場所をドロップエリアに指定することができます。  
以降では、 `main-contents` のクラスを持つdiv要素をドロップエリアとするケースを例に説明していきます。

```XML
<div class="main-contents">
</div>
```

## 2.json

file-import-socketにはjsonは必要ありません。

## 3.Javascript

### 初期化

`file-import-socket.js` を読み込んで、以下のように初期化してください。

```Javascript
// 引数には、ドロップエリアとする要素のセレクタを指定
this.fileImport_ = new FileImportSocket('.main-contents');

// enterDocumentで、file-import-socketを有効にする
this.fileImport_.enterDocument();

// exitDocumentで、file-import-socketを無効にする
this.fileImport_.exitDocument();

```

### イベント

FileImportSocket は以下のイベントを発火します。

- **FileImportSocket.EventType.RECEIVE_FILES**  
ファイルをドロップエリアにドロップしたときに発火します。  
このイベントは、ドロップされたファイルの数や名前を受け取って、アプリケーションで後続の処理をする想定で投げています。  
このイベントのリスナー関数の第二引数には、ドラッグ中にファイルの情報を保持するDataTransferオブジェクトが渡されます。  
（DataTransferオブジェクトに関して： https://developer.mozilla.org/ja/docs/DragDrop/DataTransfer ）

    ```Javascript
    // 使用例
    this.fileImport_.getEventTarget().on(FileImportSocket.EventType.RECEIVE_FILES, function(e, data) {
        var arr = [];
        for (var i = 0; i < data.files.length; i++) {
            arr.push(data.files.item(i).name); // ファイルの名称を取得して配列に追加
        }
        alert(arr); // ファイル名称のリストをアラートダイアログで表示
    });
    ```


## 4.CSS

`file-import-socket.css` を読み込んでください。


## 5.動作イメージ

https://hue.workslan/owncloud/index.php/apps/files/?dir=%2F1.HUE%2Fteam%2FSCM%2FProcurement%2FConcept%2Fsnippet_introduction#  
file-import-socket.webm  
をご覧ください。