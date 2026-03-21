import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {

  // ================= STATE =================
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ================= LOAD =================
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    const data = await AsyncStorage.getItem("expenses");
    if (data) setExpenses(JSON.parse(data));
  };

  // ================= SAVE =================
  useEffect(() => {
    AsyncStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ================= CATEGORY SUMMARY =================
  const categoryTotals = expenses.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = 0;
    acc[item.category] += item.amount;
    return acc;
  }, {});

  // ================= ADD / EDIT =================
  const addExpense = () => {

    if (!amount || !category) {
      Alert.alert("Error", "Fill all required fields");
      return;
    }

    if (isNaN(amount)) {
      Alert.alert("Error", "Amount must be number");
      return;
    }

    if (editingId) {
      const updated = expenses.map(item =>
        item.id === editingId
          ? { ...item, amount: parseFloat(amount), category, note, date }
          : item
      );
      setExpenses(updated);
      setEditingId(null);
    } else {
      const newExpense = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        category,
        note,
        date
      };
      setExpenses([...expenses, newExpense]);
    }

    // reset
    setAmount("");
    setCategory("");
    setNote("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  // ================= DELETE =================
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  // ================= TOTAL =================
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  // ================= UI =================
  return (
    <View style={styles.container}>

      <Text style={styles.title}>💰 Expense Tracker</Text>

      {/* INPUT CARD */}
      <View style={styles.card}>

        <TextInput
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />

        <TextInput
          placeholder="Enter category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />

        <TextInput
          placeholder="Add note (optional)"
          value={note}
          onChangeText={setNote}
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />

        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />

        {/* CUSTOM BUTTON */}
        <TouchableOpacity style={styles.addBtn} onPress={addExpense}>
          <Text style={styles.addBtnText}>
            {editingId ? "UPDATE EXPENSE" : "ADD EXPENSE"}
          </Text>
        </TouchableOpacity>

      </View>

      {/* TOTAL */}
      <Text style={styles.total}>Total: ₹{total}</Text>

      {/* CATEGORY SUMMARY */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📊 Category Summary</Text>

        {Object.keys(categoryTotals).map((key) => (
          <Text key={key} style={styles.summaryItem}>
            {key}: ₹{categoryTotals[key]}
          </Text>
        ))}
      </View>

      {/* EMPTY */}
      {expenses.length === 0 && (
        <Text style={styles.emptyText}>
          No expenses yet 👇
        </Text>
      )}

      {/* LIST */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <View style={styles.expenseCard}>

            <View>
              <Text style={styles.amount}>₹{item.amount}</Text>
              <Text style={styles.category}>{item.category}</Text>

              {item.note && (
                <Text style={styles.note}>📝 {item.note}</Text>
              )}

              <Text style={styles.date}>📅 {item.date}</Text>
            </View>

            <View style={styles.actions}>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  setAmount(item.amount.toString());
                  setCategory(item.category);
                  setNote(item.note || "");
                  setDate(item.date);
                  setEditingId(item.id);
                }}
              >
                <Text style={styles.btnText}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteExpense(item.id)}
              >
                <Text style={styles.btnText}>❌</Text>
              </TouchableOpacity>

            </View>

          </View>

        )}
      />

    </View>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#020617"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center"
  },

  card: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1e293b"
  },

  input: {
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: "white"
  },

  addBtn: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },

  addBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1
  },

  total: {
    color: "#38bdf8",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },

  summaryCard: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20
  },

  summaryTitle: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8
  },

  summaryItem: {
    color: "white",
    fontSize: 14
  },

  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3
  },

  actions: {
    flexDirection: "row",
    gap: 10
  },

  editBtn: {
    backgroundColor: "#f59e0b",
    padding: 10,
    borderRadius: 8
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8
  },

  btnText: {
    color: "white"
  },

  amount: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },

  category: {
    color: "#94a3b8"
  },

  note: {
    color: "#cbd5f5",
    fontSize: 12
  },

  date: {
    color: "#94a3b8",
    fontSize: 12
  },

  emptyText: {
    color: "gray",
    textAlign: "center"
  }

});