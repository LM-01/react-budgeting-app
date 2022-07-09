import React, { useContext } from 'react'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';
 
const BudgetsContext = React.createContext();

export function useBudgets() {
    return useContext(BudgetsContext);
}

// budget = {
//     id: 1,
//     name: "Entertainment",
//     max
// }

// expenses = {
//     id: 1,
//     budgetId: 1,
//     amount: 10,
//     description: "Movie",
// }

export const BudgetsProvider = ({ children }) => {
    const [budgets, setBudgets] = useLocalStorage("budgets", [])
    const [expenses, setExpenses] = useLocalStorage("expenses", [])

    function getBudgetExpenses(budgetId){
        return expenses.filter(expense => expense.budgetId === budgetId)
    }

    function addBudget({name, max }){
        setBudgets(prevBudgets => {
            if (prevBudgets.find(budget => budget.name === name)) {
                return prevBudgets;
            }
            return [...prevBudgets, {
                id: uuidv4(),
                name,
                max
            }]
        })
    }

    function addExpense({description, amount, budgetId}){
        setExpenses(prevExpenses => {
            return [...prevExpenses, { id: uuidv4(), description, amount, budgetId }]
        })
    }
    
    function deleteBudget({id}){
        setBudgets(prevBudgets => {
            return prevBudgets.filter(budget => budget.id !== id)
        })
    }

    function deleteExpense({id}){
        setExpenses(prevExpenses => {
            return prevExpenses.filter(expense => expense.id !== id)
        })
    }

    return (
        <BudgetsContext.Provider value={{
            budgets,
            expenses,
            getBudgetExpenses,
            addExpense,
            addBudget,
            deleteBudget,
            deleteExpense
        }}>
            {children}
        </BudgetsContext.Provider>
    )
}