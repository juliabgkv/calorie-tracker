const STORAGE_KEY = 'calories-app';

const goalSetupDialog = document.getElementById('goalSetupDialog');
const totalDisplay = document.getElementById('total');
const goalDisplay = document.getElementById('goal');
const mealForm = document.getElementById('mealForm');
const mealIdInput = document.getElementById('mealIdInput');
const goalInput = document.getElementById('goalInput');
const mealInput = document.getElementById('mealInput');
const caloriesInput = document.getElementById('caloriesInput');
const listItemTemplate = document.getElementById('listItemTemplate');
const mealsList = document.getElementById('mealsList');
const circularProgress = document.getElementById('circularProgress');
const circleFg = document.querySelector('#circularProgress .fg');
const persentsDisplay = document.getElementById('persents');

let caloriesData = null;
let editingCalories = 0;

document.getElementById('goalForm').addEventListener('submit', handleGoalFormSubmit);
document.getElementById('editGoalBtn').addEventListener('click', handleEditGoalBtnClick);
mealForm.addEventListener('submit', handleMealFormSubmit);
mealsList.addEventListener('click', handleOnMealsListClick);
mealForm.querySelector('#deleteBtn').addEventListener('click', handleDeleteBtnClick);
mealForm.querySelector('#cancelBtn').addEventListener('click', () => resetMealForm());
document.getElementById('clearAllBtn').addEventListener('click', handleClearAllBtnClick);

init();

function init() {
    let data = localStorage.getItem(STORAGE_KEY) || '';

    if(data) {
        caloriesData = JSON.parse(data);

        // render data
        goalDisplay.textContent = caloriesData.goal;
        totalDisplay.textContent = caloriesData.total;
        caloriesData.meals.map(meal => renderListItem(meal));
        updateCircularProgressBar();
    } else {
        caloriesData = {
            total: 0,
            goal: 0,
            meals: []
        };

        // ask goal
        goalSetupDialog.classList.add('active');
    }
}

function handleGoalFormSubmit(e) {
    e.preventDefault();
    goalSetupDialog.classList.remove('active'); // close modal

    // update goal and save
    caloriesData.goal = goalInput.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(caloriesData));

    // display new goal
    goalDisplay.textContent = caloriesData.goal;
    updateCircularProgressBar();
}

function handleMealFormSubmit(e) {
    e.preventDefault();

    if(mealForm.dataset.mode === 'add') {
        const newListItem = {
            id: new Date().valueOf(),
            meal: mealInput.value.trim(),
            calories: +caloriesInput.value
        };

        // update and save new data
        caloriesData.total += newListItem.calories;
        caloriesData.meals.push({...newListItem});
        localStorage.setItem(STORAGE_KEY, JSON.stringify(caloriesData));

        //render new data
        totalDisplay.textContent = caloriesData.total;
        renderListItem(newListItem);

    } else if(mealForm.dataset.mode === 'edit') {
        const editedListItem = {
            id: mealIdInput.value,
            meal: mealInput.value.trim(),
            calories: +caloriesInput.value
        };
        
        // update total calories
        const diff = editedListItem.calories - editingCalories;
        caloriesData.total += diff;
        editingCalories = 0;

        // replace old item with edited item
        let index = caloriesData.meals.findIndex(meal => meal.id == mealIdInput.value);
        caloriesData.meals[index] = {...editedListItem};
        
        // save new data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(caloriesData));

        /// render updated list
        totalDisplay.textContent = caloriesData.total;
        mealsList.innerHTML = '';
        caloriesData.meals.map(meal => renderListItem(meal));

        mealForm.dataset.mode = 'add'; // hide edit buttons
    }
    updateCircularProgressBar();
    mealForm.reset();
}

function renderListItem(item) {
    const clone = listItemTemplate.content.cloneNode(true);

    clone.querySelector('li').dataset.itemId = item.id;
    clone.querySelector('.meal-display').textContent = item.meal;
    clone.querySelector('.calories-display').textContent = item.calories;

    mealsList.appendChild(clone);
}

function handleOnMealsListClick(e) {
    if(e.target.classList.contains('edit-meal-btn')) {
        const currElementId = e.target.closest('.list-item').dataset.itemId;
        const currItem = caloriesData.meals.find(meal => meal.id == currElementId);

        // display editing data in form
        mealIdInput.value = currItem.id;
        mealInput.value = currItem.meal;
        caloriesInput.value = currItem.calories;

        editingCalories = currItem.calories; // save value to calculate total after saving

        mealForm.dataset.mode = 'edit';
    }
}

function handleCancelBtnClick() {
    resetMealForm();
}

function handleDeleteBtnClick() {
    let index = caloriesData.meals.findIndex(meal => meal.id == mealIdInput.value);

    if(index > -1) {
        // update total
        caloriesData.total -= +caloriesData.meals[index].calories;
        totalDisplay.textContent = caloriesData.total;

        // update list
        caloriesData.meals.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(caloriesData));

        document.querySelectorAll(`li[data-item-id="${mealIdInput.value}"]`)[0].remove(); // remove node 
        updateCircularProgressBar();

        resetMealForm();
    }
}

function handleClearAllBtnClick() {
    // set new values and save
    caloriesData.meals = [];
    caloriesData.total = 0;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(caloriesData));

    // render new data
    totalDisplay.textContent = caloriesData.total;
    mealsList.innerHTML = '';
    updateCircularProgressBar();

    // reset form if it was in edit mode
    if(mealForm.dataset.mode === 'edit') resetMealForm();
}

function handleEditGoalBtnClick() {
    goalInput.value = caloriesData.goal; //display current goal
    goalSetupDialog.classList.add('active'); // show modal window
}

function resetMealForm() {
    mealForm.reset();
    mealForm.dataset.mode = 'add'; // hide editing buttons
}

function updateCircularProgressBar() {
    let persents = (caloriesData.total == 0) ? 0 : Math.round((+caloriesData.total/+caloriesData.goal) * 100); //calc persents
    circleFg.style.opacity = (caloriesData.total) == 0 ? '0' : '1'; // hide foreground
    circleFg.style.stroke = persents > 100 ? '#ea3642' : '#5394fd'; // show red foreground when goal is exceeded

    // render
    circularProgress.style.setProperty('--progress', persents);
    persentsDisplay.textContent = `${persents} %`;
}