(function($){
  
  ApprovalFlowDiagram = function(opt_currentStep, opt_selector){
    this.currentStep_ = opt_currentStep || 1;
    this.selector_ = opt_selector || '.approval-flow-diagram';
    
    this.$element_;
  };
  
  /**
   * @param {number} step
   */
  ApprovalFlowDiagram.prototype.changeCurrentStep = function(step) {
    this.currentStep_ = step;
    this.refreshFlowStep_();
  };
  
  ApprovalFlowDiagram.prototype.enterDocument = function() {
    this.$element_ = $(this.selector_);

    this.refreshFlowStep_();
  };
  
  ApprovalFlowDiagram.prototype.exitDocument = function() {
    this.$element_ = null;
  };
  
  ApprovalFlowDiagram.prototype.refreshFlowStep_ = function() {
    var currentStepIndex = this.currentStep_ - 1;
    var arr = [];
    var $flowNodes = this.$element_.find('.flow-node');
    $.each($flowNodes, function(idx, node) {
      var $node = $(node);
      $node.removeClass('undergoing done coming');
      if (idx === currentStepIndex) {
        $node.addClass('undergoing');
      } else if (idx < currentStepIndex) {
        $node.addClass('done');
      } else if (idx > currentStepIndex) {
        $node.addClass('coming');
      }
    });
  };

}(jQuery));