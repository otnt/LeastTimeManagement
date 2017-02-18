// Initialize daily goal counter.
var dgHeader = new Vue({
  el: '#dg-header',
  data: {
    dgcount: '0'
  }
})

// Initialize component of daily goal list.

var registerWaitComponent = function(order, width, offset) {
  Vue.component(`daily-goal-wait-${order}`, {
    template:
    `<div class="row my-1">
      <input class="form-control mb-2 col-${width} offset-${offset} " type="text" placeholder="Add a daily goal...">
    </div>`
  })
}

registerWaitComponent(1, 12, 0)
registerWaitComponent(2, 11, 1)
registerWaitComponent(3, 10, 2)
registerWaitComponent(4, 9, 3)

var registerActiveComponent = function(order, width, offset) {
  Vue.component(`daily-goal-active-${order}`, {
    template:
    `<div class="row my-1">
      <input class="form-control mb-2 col-${width} offset-${offset} " type="text" placeholder="Add a daily goal...">
      <div class="w-100"></div>
      <button type="button" class="btn btn-success col-1 offset-${offset} align-self-start mr-2">Save</button>
      <button type="button" class="btn btn-danger col-1 align-self-start">Discard</button>
    </div>`
  })
}

registerActiveComponent(1, 12, 0)
registerActiveComponent(2, 11, 1)
registerActiveComponent(3, 10, 2)
registerActiveComponent(4, 9, 3)

// Initialize
new Vue({
  el: '.container',
  data: {}
})
