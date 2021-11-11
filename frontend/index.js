let states;
let timer;

function changeTimeIntToStr(intTime) {
  let hour = String(parseInt(intTime / 3600));
  intTime = intTime % 3600;
  
  let minute = String(parseInt(intTime / 60));
  intTime = intTime % 60;
  
  let second = String(parseInt(intTime));

  if(hour < 10) {
    hour = '0' + hour;
  }
  if(minute < 10) {
    minute = '0' + minute;
  }
  if(second < 10) {
    second = '0' + second;
  }
  return hour+':'+minute+':'+second;
}

window.addEventListener('beforeunload', () => {
  console.log('서버에 저장해달라 요청');
})

function taskListPresenter(tasks) {
  let taskList = makeDomWithClassName('div','taskList');
  
  taskList.appendChild(totalTaskTimePresenter(states.get('totalTime')));
  taskList.appendChild(taskAdderPresenter());

  states.get('tasks').forEach((task) => {
    taskList.appendChild(taskPresenter(task));
  })
  return taskList;
}

function taskAdderPresenter() {
  let taskAdder = makeDomWithClassName('div','taskAdder');
  let addTaskInput = makeDomWithClassName('input', 'addTaskInput');
  let addTaskBtn = makeDomWithClassName('button', 'addTaskBtn');
  addTaskBtn.innerHTML='+'
  addTaskBtn.addEventListener('click', () => {
    if(addTaskInput.value == '') {
      console.log('입력을 해야지')
      return;
    }
    let new_task = {
      title:addTaskInput.value,
      time: 0,
      details: []
    };
    states.set('tasks', [new_task ,...states.get('tasks')])
  })

  taskAdder.appendChild(addTaskInput);
  taskAdder.appendChild(addTaskBtn);
  return taskAdder;
}

function taskPresenter(task) {
  let time = task['time'];
  let isTimerActive = task['isTimerActive'];

  let taskItem = makeDomWithClassName('div', 'taskItem');
  
  let task__title = makeDomWithClassName('div', 'task__title');
  task__title.innerHTML = task['title'];
  
  let task__time = makeDomWithClassName('div', 'task__time');
  task__time.innerHTML = changeTimeIntToStr(task['time']);
  
  let task__timerBtn = makeDomWithClassName('button', 'task__timerBtn');
  task__timerBtn.innerHTML= isTimerActive? '멈추기':'시간재기';

  task__timerBtn.addEventListener('click', function() {
    new_tasks = states.get('tasks');
    for(let i = 0; i < new_tasks.length; i++) {
      if (new_tasks[i].title === task.title) {
        new_tasks[i].isTimerActive = !task.isTimerActive;
      }
    }
    states.set(new_tasks);
    if(isTimerActive) {
      clearInterval(states.timer);
      
    } else {
      states.timer = setInterval(() => {
        states.set('totalTime', states.get('totalTime')+1);
        new_tasks = states.get('tasks');
        for(let i = 0; i < new_tasks.length; i++) {
          if(new_tasks[i].title === task.title) {
            new_tasks[i].time += 1;
          }
        }
        states.set('tasks', new_tasks);
      }, 1000 )
      
    }
    
  })

  let task__details = makeDomWithClassName('div','task__details');
  task['details'].forEach((detail) => {
    task__details.appendChild(taskDetailPresenter(detail));
  })
  
  let task__addDetailInput = makeDomWithClassName('input', 'task__addDetailInput');
  let task__addDetailBtn = makeDomWithClassName('button', 'task__addDetailBtn');
  task__addDetailBtn.innerHTML = '세부사항 추가';
  task__addDetailBtn.addEventListener('click', () => {
    if(task__addDetailInput.value === '') {
      console.log('입력을 해야지');
      return;
    }
    let new_detail = task__addDetailInput.value;
    let new_task = {
      ...task,
      details: [...task.details,new_detail]
    };
    
    let new_tasks = [];
    states.get('tasks').forEach((task) => {
      if(task.title !== new_task.title) {
        new_tasks.push(task);
      } else {
        new_tasks.push(new_task);
      }
    })
    states.set('tasks', new_tasks);
  });

  taskItem.appendChilds(task__title, task__time, task__timerBtn, task__details, task__addDetailInput, task__addDetailBtn);
  return taskItem;
}

function taskDetailPresenter(detail) {
  let task__detail = makeDomWithClassName('div', 'task__detail');
  let task__detailDescription = makeDomWithClassName('div', 'task__detailDescription');
  task__detailDescription.innerHTML = detail;
  let task__completeDetailBtn = makeDomWithClassName('button', 'task__completeDetailBtn');
  task__completeDetailBtn.innerHTML='완료';
  let task__deleteDetailBtn = makeDomWithClassName('button', 'task__deleteDetailBtn');
  task__deleteDetailBtn.innerHTML='삭제';
  task__detail.appendChilds(task__detailDescription, task__completeDetailBtn, task__deleteDetailBtn);
  return task__detail;
}

function totalTaskTimePresenter(time) {
  let totalTaskTime = makeDomWithClassName('div','totalTaskTime');
  totalTaskTime.innerHTML = '총 공부시간 ' + changeTimeIntToStr(time);
  return totalTaskTime;
}

function makeDomWithClassName(type, className) {
  let dom = document.createElement(type);
  dom.appendChilds = function() {
    let childs = Array.from(arguments);
    
    childs.forEach((child) => {
      dom.appendChild(child);
    })
  }
  dom.className = className;
  return dom;
}

function state() {
  let states = {};
  // 상태변수들 목록
  function set(state, value) {
    states[state] = value;
    render(taskListPresenter(states));
  }
  function get(state) {
    return states[state];
  }
  return {
    set: set,
    get: get,
    timer:null
  }
}

async function init() {
  states = state();
  states.set('tasks',[
    {
      title: '코딩',
      time: 3666,
      details: [
        '토이프젝',
        'CS'
      ],
      isTimerActive: false
    },
    {
      title: '운동',
      time: 7159,
      details: [
        '달리기',
        '스트레칭'
      ],
      isTimerActive: false
    }
  ]);
  states.set('totalTime', 3666+7159);
  render(taskListPresenter(states.get('tasks')));
}

function render(dom) {
  const app = document.querySelector('.app');
  app.innerHTML = '';
  app.appendChild(dom);
}

init();