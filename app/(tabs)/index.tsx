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
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null); // 🔥 Edit mode tracker

  // -------------------------------
  // LOAD DATA FROM STORAGE
  // -------------------------------
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await AsyncStorage.getItem("expenses");

      if (data !== null) {
        setExpenses(JSON.parse(data));
      }
    } catch (error) {
      console.log("Error loading data:", error);
    }
  };

  // -------------------------------
  // AUTO SAVE TO STORAGE
  // -------------------------------
  useEffect(() => {
    AsyncStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // -------------------------------
  // ADD / EDIT EXPENSE
  // -------------------------------
  const addExpense = () => {

    // Validation
    if (!amount || !category) {
      Alert.alert("Error", "Please enter all fields");
      return;
    }

    if (isNaN(amount)) {
      Alert.alert("Error", "Amount must be a number");
      return;
    }

    if (editingId) {
      // ✏️ EDIT MODE
      const updatedExpenses = expenses.map(item =>
        item.id === editingId
          ? { ...item, amount: parseFloat(amount), category }
          : item
      );

      setExpenses(updatedExpenses);
      setEditingId(null);

    } else {
      // ➕ ADD MODE
      const newExpense = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        category
      };

      setExpenses([...expenses, newExpense]);
    }

    // Clear inputs
    setAmount("");
    setCategory("");
  };

  // -------------------------------
  // DELETE EXPENSE
  // -------------------------------
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(item => item.id !== id));
  };

  // -------------------------------
  // TOTAL CALCULATION
  // -------------------------------
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  // ================================
  // UI
  // ================================
  return (
    <View style={styles.container}>

      {/* TITLE */}
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

        {/* Dynamic button */}
        <Button
          title={editingId ? "Update Expense" : "Add Expense"}
          onPress={addExpense}
        />

      </View>

      {/* TOTAL */}
      <Text style={styles.total}>Total: ₹{total}</Text>

      {/* EMPTY STATE */}
      {expenses.length === 0 && (
        <Text style={styles.emptyText}>
          No expenses yet. Add one 👇
        </Text>
      )}

      {/* LIST */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>

            {/* Expense Info */}
            <View>
              <Text style={styles.amount}>₹{item.amount}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", gap: 10 }}>

              {/* EDIT */}
              <Button
                title="✏️"
                onPress={() => {
                  setAmount(item.amount.toString());
                  setCategory(item.category);
                  setEditingId(item.id);
                }}
              />

              {/* DELETE */}
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
    marginBottom: 10,
    textAlign: "center"
  },

  emptyText: {
    color: "gray",
    textAlign: "center",
    marginBottom: 10
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    color: "#94a3b8",
    fontSize: 14
  }

});