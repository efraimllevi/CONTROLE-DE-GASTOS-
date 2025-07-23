import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState('income');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (!description || !value) return;
    const newTransaction = {
      id: Date.now(),
      description,
      value: parseFloat(value),
      type,
    };
    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setValue('');
  };

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.value, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.value, 0);

  const balance = income - expense;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Controle Financeiro</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm">Receitas</p>
            <p className="text-green-600 font-bold text-lg">R$ {income.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm">Despesas</p>
            <p className="text-red-600 font-bold text-lg">R$ {expense.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm">Saldo</p>
            <p className="font-bold text-lg">R$ {balance.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 space-y-2">
        <Input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="Valor"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex gap-4">
          <Button
            variant={type === 'income' ? 'default' : 'outline'}
            onClick={() => setType('income')}
          >
            Receita
          </Button>
          <Button
            variant={type === 'expense' ? 'default' : 'outline'}
            onClick={() => setType('expense')}
          >
            Despesa
          </Button>
        </div>
        <Button className="w-full mt-2" onClick={addTransaction}>
          Adicionar
        </Button>
      </div>

      <div className="space-y-2">
        {transactions.map(t => (
          <Card key={t.id}>
            <CardContent className="p-4 flex justify-between">
              <span>{t.description}</span>
              <span className={t.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                R$ {t.value.toFixed(2)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
