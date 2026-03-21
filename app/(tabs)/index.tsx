import { useState, useEffect } from "react";
import {
  View,
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

  // LOAD
  useEffect(() => {
    AsyncStorage.getItem("expenses").then(data => {
      if (data) setExpenses(JSON.parse(data));
    });
  }, []);

  // SAVE
  useEffect(() => {
    AsyncStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ADD
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

  // DELETE
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // TOTAL
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // CATEGORY SUMMARY
  const categoryTotals: any = {};
  expenses.forEach(e => {
    if (!categoryTotals[e.category]) categoryTotals[e.category] = 0;
    categoryTotals[e.category] += e.amount;
  });

  const colors = ["#facc15", "#38bdf8", "#4ade80", "#fb7185"];

  const chartData = Object.keys(categoryTotals).map((key, index) => ({
    name: key,
    amount: categoryTotals[key],
    color: colors[index % colors.length],
    legendFontColor: "white",
    legendFontSize: 12
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.welcome}>Welcome 👋</Text>
          <Text style={styles.username}>Pravallika</Text>
        </View>

        <View style={styles.avatar}>
          <Text>👩</Text>
        </View>
      </View>

      {/* TOTAL CARD */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Balance</Text>
        <Text style={styles.totalText}>₹{total}</Text>
      </View>

      {/* CATEGORY CARDS */}
      <Text style={styles.sectionTitle}>Categories</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.keys(categoryTotals).map((key, index) => (
          <View key={key} style={styles.categoryCard}>
            <View style={[styles.colorDot, { backgroundColor: colors[index % colors.length] }]} />
            <Text style={styles.categoryName}>{key}</Text>
            <Text style={styles.categoryAmount}>₹{categoryTotals[key]}</Text>
          </View>
        ))}
      </ScrollView>

      {/* PIE CHART */}
      {chartData.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Spending Breakdown</Text>

          <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={180}
            chartConfig={{ color: () => `white` }}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"10"}
            absolute
          />
        </View>
      )}

      {/* INPUT */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Add Expense</Text>

        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
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
          <Text style={styles.btnText}>+ ADD EXPENSE</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <Text style={styles.sectionTitle}>Recent Expenses</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
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
              <Text style={{ color: "white" }}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a"
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },

  welcome: {
    color: "#94a3b8"
  },

  username: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },

  avatar: {
    backgroundColor: "#facc15",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },

  totalCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15
  },

  totalLabel: {
    color: "#94a3b8"
  },

  totalText: {
    color: "#facc15",
    fontSize: 26,
    fontWeight: "bold"
  },

  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10
  },

  // CATEGORY CARDS
  categoryCard: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    width: 120
  },

  categoryName: {
    color: "#94a3b8"
  },

  categoryAmount: {
    color: "white",
    fontWeight: "bold",
    marginTop: 5
  },

  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 8
  },

  chartCard: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center"
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
    marginBottom: 12,
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