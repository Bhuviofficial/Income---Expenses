const entryForm = document.getElementById("entry-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const entriesList = document.getElementById("entries-list");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const netBalance = document.getElementById("net-balance");
const resetBtn = document.getElementById("reset-btn");
const clearAllBtn = document.getElementById("clear-all");
const editingIdInput = document.getElementById("editing-id");
const filters = document.querySelectorAll("input[name='filter']");

const STORAGE_KEY = "incomeExpenseData";

let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
function resetForm() {
  descInput.value = "";
  amountInput.value = "";
  document.querySelector("input[name='type'][value='income']").checked = true;
  editingIdInput.value = "";
  document.getElementById("save-btn").innerText = "Add Entry";
}

function updateTotals() {
  const income = entries
    .filter(e => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const expense = entries
    .filter(e => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const balance = income - expense;
   totalIncome.textContent = `₹${income.toFixed(2)}`;
  totalExpense.textContent = `₹${expense.toFixed(2)}`;
  netBalance.textContent = `₹${balance.toFixed(2)}`;
}
function renderEntries() {
  const filterValue = document.querySelector("input[name='filter']:checked").value;
  entriesList.innerHTML = "";

  const filteredEntries =
    filterValue === "all"
      ? entries
      : entries.filter(e => e.type === filterValue);

       if (filteredEntries.length === 0) {
    entriesList.innerHTML = `<p class="text-center text-slate-500 text-sm">No entries found</p>`;
    updateTotals();
    return;
  }
   filteredEntries.forEach(entry => {
    const div = document.createElement("div");
    div.className =
      "flex justify-between items-center border p-3 rounded hover:bg-slate-50 transition";
    div.innerHTML = `
      <div>
        <p class="font-medium">${entry.desc}</p>
        <p class="text-sm text-slate-500">${entry.type === "income" ? "Income" : "Expense"} • ₹${entry.amount.toFixed(2)}</p>
      </div>
      <div class="flex gap-2">
        <button class="edit-btn text-blue-600" data-id="${entry.id}">Edit</button>
        <button class="delete-btn text-red-600" data-id="${entry.id}">Delete</button>
      </div>
    `;
    entriesList.appendChild(div);
  });
  updateTotals();
}
//CRUD:-
entryForm.addEventListener("submit", e => {
  e.preventDefault();

  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = document.querySelector("input[name='type']:checked").value;
  const editingId = editingIdInput.value;

  if (!desc || isNaN(amount) || amount <= 0) {
    alert("Please enter valid description and amount.");
    return;
  }
    if (editingId) {

    entries = entries.map(entry =>
      entry.id === editingId ? { ...entry, desc, amount, type } : entry
    );
  } else {

    const newEntry = {
      id: Date.now().toString(),
      desc,
      amount,
      type,
    };
    entries.push(newEntry);
  }
    saveToLocalStorage();
  renderEntries();
  resetForm();
});
// Edit or Delete:-
entriesList.addEventListener("click", e => {
  if (e.target.classList.contains("edit-btn")) {
    const id = e.target.dataset.id;
    const entry = entries.find(ent => ent.id === id);
    if (!entry) return;

    descInput.value = entry.desc;
    amountInput.value = entry.amount;
    document.querySelector(`input[name='type'][value='${entry.type}']`).checked = true;
    editingIdInput.value = entry.id;
    document.getElementById("save-btn").innerText = "Update Entry";
  }
 if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    entries = entries.filter(ent => ent.id !== id);
    saveToLocalStorage();
    renderEntries();
  }
});

// Reset Form:-
resetBtn.addEventListener("click", resetForm);

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all entries?")) {
    entries = [];
    saveToLocalStorage();
    renderEntries();
  }
});
filters.forEach(filter => {
  filter.addEventListener("change", renderEntries);
});
renderEntries();