(function ($) {

    /**
     *
     * @param selector query-selector of drop zone
     * @returns
     */
    FileImportSocket = function (selector) {
        this.selector_ = selector;
        this.$element_;
    };

    FileImportSocket.EventType = {
        RECEIVE_FILES: 'receive-files'
    };

    FileImportSocket.DROP_ZONE_HTML_ = '<div class="file-import-drop-zone"><span class="content-caption">ここにファイルまたはフォルダをドロップ</span></div>';

    FileImportSocket.prototype.enterDocument = function () {
        this.$element_ = $(this.selector_);
        this.bindEvents_();
    }

    FileImportSocket.prototype.exitDocument = function () {
        this.unbindEvents_();
        this.$element_ = null;
    }

    FileImportSocket.prototype.getEventTarget = function () {
        return this.$element_;
    };

    FileImportSocket.prototype.bindEvents_ = function () {
        this.$element_.on('dragover', this.onDragEnterFile_.bind(this));
        this.$element_.on('dragleave', '.file-import-drop-zone', this.onLeaveDropZone_.bind(this));
        this.$element_.on('drop', '.file-import-drop-zone', this.onDropFile_.bind(this));
    };

    FileImportSocket.prototype.unbindEvents_ = function () {
        this.$element_.off();
    };

    FileImportSocket.prototype.onDragEnterFile_ = function (e) {
        this.preventEvent_(e);
        var $target = this.$element_.find('.file-import-drop-zone');
        if ($target.length === 0) {
            $target = $(FileImportSocket.DROP_ZONE_HTML_);
            this.$element_.append($target);
        }
        $target.parent().addClass('file-import-drop-zone-parent');
        $target.addClass('active');
    };

    FileImportSocket.prototype.onLeaveDropZone_ = function (e) {
        this.preventEvent_(e);
        var $target = this.$element_.find('.file-import-drop-zone');
        $target.removeClass('active');
        $target.parent().removeClass('file-import-drop-zone-parent');
    };

    FileImportSocket.prototype.onDropFile_ = function (e) {
        this.preventEvent_(e);
        var $target = this.$element_.find('.file-import-drop-zone');
        $target.removeClass('active');
        var data = e.originalEvent.dataTransfer;
        this.getEventTarget().trigger(FileImportSocket.EventType.RECEIVE_FILES, data);
    };

    FileImportSocket.prototype.preventEvent_ = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };
}(jQuery));