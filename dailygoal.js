// Initialize daily goal counter.
var dgHeader = new Vue({
  el: '#dg-header',
  data: {
    dgcount: '0'
  }
})

// Initialize component of daily goal list before user input.
Vue.component('daily-goal-wait-1', {
  template:
  '<div class="row my-1">'
  + '  <input class="form-control mb-2 col-12 offset-0 " type="text" placeholder="Add a daily goal...">'
  + '</div>'
})
Vue.component('daily-goal-wait-2', {
  template:
  '<div class="row my-1">'
  + '  <input class="form-control mb-2 col-11 offset-1 " type="text" placeholder="Add a daily goal...">'
  + '</div>'
})
Vue.component('daily-goal-wait-3', {
  template:
  '<div class="row my-1">'
  + '  <input class="form-control mb-2 col-10 offset-2 " type="text" placeholder="Add a daily goal...">'
  + '</div>'
})
Vue.component('daily-goal-wait-4', {
  template:
  '<div class="row my-1">'
  + '  <input class="form-control mb-2 col-9 offset-3 " type="text" placeholder="Add a daily goal...">'
  + '</div>'
})

Vue.component('daily-goal-active-1', {
  template:
  '<div class="row my-1">'
  + '  <input class="form-control mb-2 col-12 offset-0 " type="text" placeholder="Add a daily goal...">'
  + '  <div class="w-100"></div>'
  + '  <button type="button" class="btn btn-success col-1 offset-0 align-self-start mr-2">Save</button>'
  + '  <button type="button" class="btn btn-danger col-1 align-self-start">Discard</button>'
  + '</div>'
})

Vue.component('daily-goal-active-2', {
  template:
  '<div class="row my-1">'
  + '  <input class="form-control mb-2 col-11 offset-1 " type="text" placeholder="Add a daily goal...">'
  + '  <div class="w-100"></div>'
  + '  <button type="button" class="btn btn-success col-1 offset-1 align-self-start mr-2">Save</button>'
  + '  <button type="button" class="btn btn-danger col-1 align-self-start">Discard</button>'
  + '</div>'
})

Vue.component('daily-goal-active-3', {
  template:
  '<div class="row my-1">'
  + '  <input class="form-control mb-2 col-10 offset-2 " type="text" placeholder="Add a daily goal...">'
  + '  <div class="w-100"></div>'
  + '  <button type="button" class="btn btn-success col-1 offset-2 align-self-start mr-2">Save</button>'
  + '  <button type="button" class="btn btn-danger col-1 align-self-start">Discard</button>'
  + '</div>'
})

Vue.component('daily-goal-active-4', {
  template:
  '<div class="row my-1">'
  + '  <input class="form-control mb-2 col-9 offset-3 " type="text" placeholder="Add a daily goal...">'
  + '  <div class="w-100"></div>'
  + '  <button type="button" class="btn btn-success col-1 offset-3 align-self-start mr-2">Save</button>'
  + '  <button type="button" class="btn btn-danger col-1 align-self-start">Discard</button>'
  + '</div>'
})



// Initialize
new Vue({
  el: '.container',
  data: {}
})
