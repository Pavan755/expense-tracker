import { useState, useEffect } from "react";
import {
  ScrollView, 
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [expenses, setExpenses] = useState([]);

  // ================= LOAD =================
  useEffect(() => {
    AsyncStorage.getItem("expenses").then(data => {
      if (data) setExpenses(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ================= ADD =================
  const addExpense = () => {
    if (!amount || !category) return;

    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      note
    };

    setExpenses([...expenses, newExpense]);
    setAmount("");
    setCategory("");
    setNote("");
  };

  // ================= DELETE =================
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // ================= TOTAL =================
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // ================= CATEGORY DATA =================
  const categoryTotals = {};
  expenses.forEach(e => {
    if (!categoryTotals[e.category]) categoryTotals[e.category] = 0;
    categoryTotals[e.category] += e.amount;
  });

  const chartData = Object.keys(categoryTotals).map((key, index) => ({
    name: key,
    amount: categoryTotals[key],
    color: ["#facc15", "#38bdf8", "#4ade80", "#fb7185"][index % 4],
    legendFontColor: "white",
    legendFontSize: 12
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>

      {/* HEADER */}
      <Text style={styles.header}>💰 Expense Dashboard</Text>

      {/* TOTAL CARD */}
      <View style={styles.totalCard}>
        <Text style={styles.totalText}>₹{total}</Text>
        <Text style={styles.subText}>Total Spent</Text>
      </ScrollView>

      {/* PIE CHART */}
      {chartData.length > 0 && (
        <PieChart
          data={chartData}
          width={screenWidth - 40}
          height={180}
          chartConfig={{
            color: () => `white`
          }}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      )}

      {/* INPUT CARD */}
      <View style={styles.card}>
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />
        <TextInput
          placeholder="Note"
          value={note}
          onChangeText={setNote}
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity style={styles.addBtn} onPress={addExpense}>
          <Text style={styles.btnText}>ADD EXPENSE</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>

            <View>
              <Text style={styles.amount}>₹{item.amount}</Text>
              <Text style={styles.category}>{item.category}</Text>
              {item.note && <Text style={styles.note}>{item.note}</Text>}
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteExpense(item.id)}
            >
              <Text style={{ color: "white" }}>❌</Text>
            </TouchableOpacity>

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
    backgroundColor: "#0f172a"
  },

  header: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15
  },

  totalCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15
  },

  totalText: {
    color: "#facc15",
    fontSize: 26,
    fontWeight: "bold"
  },

  subText: {
    color: "#94a3b8"
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginVertical: 15
  },

  input: {
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: "white"
  },

  addBtn: {
    backgroundColor: "#38bdf8",
    padding: 14,
    borderRadius: 10,
    alignItems: "center"
  },

  btnText: {
    color: "white",
    fontWeight: "bold"
  },

  itemCard: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  amount: {
    color: "white",
    fontWeight: "bold"
  },

  category: {
    color: "#94a3b8"
  },

  note: {
    color: "#cbd5f5",
    fontSize: 12
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8
  }

});