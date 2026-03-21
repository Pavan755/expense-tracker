import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ================================
// MAIN COMPONENT
// ================================
export default function HomeScreen() {

  // -------------------------------
  // STATE VARIABLES
  // -------------------------------
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");                 // 🆕 optional note
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );                                                   // 🆕 date
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // -------------------------------
  // LOAD DATA
  // -------------------------------
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await AsyncStorage.getItem("expenses");
      if (data !== null) setExpenses(JSON.parse(data));
    } catch (error) {
      console.log("Error loading:", error);
    }
  };

  // -------------------------------
  // SAVE DATA
  // -------------------------------
  useEffect(() => {
    AsyncStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // -------------------------------
  // ADD / EDIT
  // -------------------------------
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
      // ✏️ EDIT
      const updated = expenses.map(item =>
        item.id === editingId
          ? { ...item, amount: parseFloat(amount), category, note, date }
          : item
      );
      setExpenses(updated);
      setEditingId(null);

    } else {
      // ➕ ADD
      const newExpense = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        category,
        note,
        date
      };
      setExpenses([...expenses, newExpense]);
    }

    // Clear inputs
    setAmount("");
    setCategory("");
    setNote("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  // -------------------------------
  // DELETE
  // -------------------------------
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  // -------------------------------
  // TOTAL
  // -------------------------------
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  // ================================
  // UI
  // ================================
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

        <Button
          title={editingId ? "Update Expense" : "Add Expense"}
          onPress={addExpense}
        />

      </View>

      {/* TOTAL */}
      <Text style={styles.total}>Total: ₹{total}</Text>

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
          <View style={styles.itemRow}>

            <View>
              <Text style={styles.amount}>₹{item.amount}</Text>
              <Text style={styles.category}>{item.category}</Text>

              {item.note ? (
                <Text style={styles.note}>📝 {item.note}</Text>
              ) : null}

              <Text style={styles.date}>📅 {item.date}</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>

              <Button
                title="✏️"
                onPress={() => {
                  setAmount(item.amount.toString());
                  setCategory(item.category);
                  setNote(item.note || "");
                  setDate(item.date);
                  setEditingId(item.id);
                }}
              />

              <Button
                title="❌"
                onPress={() => deleteExpense(item.id)}
              />

            </View>

          </View>
        )}
      />

    </View>
  );
}

// ================================
// STYLES
// ================================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center"
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20
  },

  input: {
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: "white"
  },

  total: {
    color: "#38bdf8",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },

  emptyText: {
    color: "gray",
    textAlign: "center"
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
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
  }

});