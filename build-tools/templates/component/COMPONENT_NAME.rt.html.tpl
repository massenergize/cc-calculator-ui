<div class="cc-component" id="<%= componentNameLowerCase %>">
  <div class="cc-component__header">
    <img src="/assets/img/{this.route_key}.png"/>
    <span>{this.title}</span>
  </div>

  <div class="cc-component__form"></div>

  <div class="cc-component__nav">
    <button rt-if="this.route_key !== 'get_started'" class="btn">{this.t('Previous')}</button>
    <button rt-if="this.route_key !== 'take_action'" class="btn">{this.t('Next')}</button>
    <a rt-if="this.route_key !== 'get_started'" onClick="{this.router.previous.bind(this.router)}">{this.t('Previous')}</a>
    <a rt-if="this.route_key !== 'take_action'" onClick="{this.router.next.bind(this.router)}">{this.t('Next')}</a>
  </div>
</div>
