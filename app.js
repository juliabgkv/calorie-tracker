const STORAGE_KEY = 'calories-app';
const goalSetupDialog = document.querySelector('#goalSetupDialog');
const goalForm = document.querySelector('#goalForm');
const totalDisplay = document.querySelector('#total');
const goalDisplay = document.querySelector('#goal');
const editGoalBtn = document.querySelector('#editGoalBtn');
const mealForm = document.querySelector('#mealForm');
const mealIdInput = document.querySelector('#mealIdInput');
const mealInput = document.querySelector('#mealInput');
const caloriesInput = document.querySelector('#caloriesInput');
const listItemTemplate = document.querySelector('#listItemTemplate');
const mealsList = document.querySelector('#mealsList');
let caloriesData = null;
let editingCalories = 0;

goalForm.addEventListener('submit', handleGoalFormSubmit);
editGoalBtn.addEventListener('click', () => goalSetupDialog.classList.add('active'));
mealForm.addEventListener('submit', handleMealFormSubmit);
mealsList.addEventListener('click', handleOnMealsListClick);
mealForm.querySelector('#deleteBtn').addEventListener('click', handleDeleteBtnClick);
mealForm.querySelector('#cancelBtn').addEventListener('click', handleCancelBtnClick);

init();

function init() {
    let data = localStorage.getItem(STORAGE_KEY) || '';

    if(data) {
        caloriesData = JSON.parse(data);

        goalDisplay.textContent = caloriesData.goal;
        totalDisplay.textContent = caloriesData.total;
        caloriesData.meals.map(meal => renderListItem(meal));
    } else {
        goalSetupDialog.classList.add('active');
    }
}

function handleGoalFormSubmit(e) {
    e.preventDefault();
    goalSetupDialog.classList.remove('active');

    const goalInput = document.querySelector('#goalInput').value;
    caloriesData = {
        total: 0,
        goal: goalInput,
        meals: []
    };

    goal.textContent  = caloriesData.goal;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(caloriesData));
}

function handleMealFormSubmit(e) {
    e.preventDefault();

    if(mealForm.dataset.mode === 'add') {
        const newListItem = {
            id: new Date().valueOf(),
            meal: mealInput.value.trim(),
            calories: +caloriesInput.value.trim()
        };

        // update total calories
        caloriesData.total += newListItem.calories;
        totalDisplay.textContent = caloriesData.total;

        caloriesData.meals.push({...newListItem});
        localStorage.setItem(STORAGE_KEY, JSON.stringify(caloriesData));
    
        mealForm.reset();
    
        //render list item
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
        totalDisplay.textContent = caloriesData.total;
        editingCalories = 0;

        // replace old item with edited item
        let index = caloriesData.meals.findIndex(meal => meal.id == mealIdInput.value);
        caloriesData.meals[index] = {...editedListItem};
        
        // save in localstorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(caloriesData));

        let data = localStorage.getItem(STORAGE_KEY);
        caloriesData = JSON.parse(data);

        mealForm.reset();
        mealForm.dataset.mode = 'add';

        /// render updated list
        mealsList.innerHTML = '';
        caloriesData.meals.map(meal => renderListItem(meal));
    }

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

        mealIdInput.value = currItem.id;
        mealInput.value = currItem.meal;
        caloriesInput.value = currItem.calories;

        editingCalories = currItem.calories; // save value to calculate after saving

        mealForm.dataset.mode = 'edit';
    }
}

function handleCancelBtnClick() {
    mealForm.reset(); // reset form
    mealForm.dataset.mode = 'add'; // hide editing buttons
}

function handleDeleteBtnClick() {
    let index = caloriesData.meals.findIndex(meal => meal.id == mealIdInput.value);

    if(index > -1) {
        // update total 
        caloriesData.total -= +caloriesInput.value;
        totalDisplay.textContent = caloriesData.total;

        // update list
        caloriesData.meals.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(caloriesData));

        document.querySelectorAll(`li[data-item-id="${mealIdInput.value}"]`)[0].remove(); // remove node 

        mealForm.reset(); // reset form
        mealForm.dataset.mode = 'add'; // hide editing buttons
    }
}
