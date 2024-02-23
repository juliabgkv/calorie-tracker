const STORAGE_KEY = 'calories-app';
const goalSetupDialog = document.querySelector('#goalSetupDialog');
const goalForm = document.querySelector('#goalForm');
const total = document.querySelector('#total');
const goal = document.querySelector('#goal');
const editGoalBtn = document.querySelector('#editGoalBtn');

let caloriesData = null;

goalForm.addEventListener('submit', handleGoalFormSubmit);
editGoalBtn.addEventListener('click', () => goalSetupDialog.showModal());

init();

function init() {
    let data = localStorage.getItem(STORAGE_KEY) || '';

    if(data) {
        caloriesData = JSON.parse(data);
        goal.innerText = caloriesData.goal;
    } else {
        goalSetupDialog.showModal();
    }
}

function handleGoalFormSubmit(e) {
    e.preventDefault();
    goalSetupDialog.close();

    const goalInput = document.querySelector('#goalInput').value;
    caloriesData = {
        total: 0,
        goal: goalInput,
        meals: [
            { id: '', meal: '', calories: 0 }
        ]
    };

    goal.innerText = caloriesData.goal;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(caloriesData));
}
