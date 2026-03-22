import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

type Expense = {
  id: string;
  amount: number;
  category: string;
  note: string;
};

export default function HomeScreen() {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // NEW STATES
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // LOAD
  useEffect(() => {
    AsyncStorage.getItem("expenses").then(data => {
      if (!data) return;

      try {
        const parsed = JSON.parse(data) as Expense[];
        if (Array.isArray(parsed)) {
          setExpenses(parsed);
        }
      } catch {
        setExpenses([]);
      }
    });
  }, []);

  // SAVE
  useEffect(() => {
    AsyncStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ADD
  const addExpense = () => {
    if (!amount || !category) return;

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount)) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parsedAmount,
      category,
      note
    };

    setExpenses([...expenses, newExpense]);
    setAmount("");
    setCategory("");
    setNote("");
  };

  // DELETE
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // EDIT SAVE
  const saveEdit = () => {
    if (!editingExpense) return;

    const updated = expenses.map(e =>
      e.id === editingExpense.id ? editingExpense : e
    );
    setExpenses(updated);
    setModalVisible(false);
    setEditingExpense(null);
  };

  // TOTAL
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // CATEGORY TOTALS
  const categoryTotals: Record<string, number> = {};
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

  // FILTER LOGIC
  const filteredExpenses =
    selectedFilter === "All"
      ? expenses
      : expenses.filter(e => e.category === selectedFilter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.username}>Dashboard</Text>
      </View>

      {/* TOTAL */}
      <View style={styles.totalCard}>
        <Text style={styles.totalText}>₹{total}</Text>
      </View>

      {/* CATEGORY FILTERS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterBtn, selectedFilter === "All" && styles.activeFilter]}
          onPress={() => setSelectedFilter("All")}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>

        {Object.keys(categoryTotals).map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterBtn, selectedFilter === cat && styles.activeFilter]}
            onPress={() => setSelectedFilter(cat)}
          >
            <Text style={styles.filterText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* PIE CHART */}
      {chartData.length > 0 && (
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
      )}

      {/* ADD */}
      <View style={styles.card}>
        <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} style={styles.input} />
        <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />
        <TextInput placeholder="Note" value={note} onChangeText={setNote} style={styles.input} />

        <TouchableOpacity style={styles.addBtn} onPress={addExpense}>
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>

            <View>
              <Text style={styles.amount}>₹{item.amount}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  setEditingExpense(item);
                  setModalVisible(true);
                }}
              >
                <Text>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteExpense(item.id)}
              >
                <Text style={{ color: "white" }}>✕</Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />

      {/* MODAL */}
      <Modal visible={modalVisible} transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>

            <TextInput
              value={editingExpense ? editingExpense.amount.toString() : ""}
              onChangeText={(val) => {
                const parsedAmount = parseFloat(val);
                setEditingExpense(current => {
                  if (!current || Number.isNaN(parsedAmount)) return current;
                  return { ...current, amount: parsedAmount };
                });
              }}
              style={styles.input}
            />

            <TextInput
              value={editingExpense?.category ?? ""}
              onChangeText={(val) => {
                setEditingExpense(current => {
                  if (!current) return current;
                  return { ...current, category: val };
                });
              }}
              style={styles.input}
            />

            <TouchableOpacity style={styles.addBtn} onPress={saveEdit}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a"
  },

  headerRow: {
    marginBottom: 8
  },

  username: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },

  totalCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center"
  },

  totalText: {
    color: "#facc15",
    fontSize: 24,
    fontWeight: "bold"
  },

  filterBtn: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 8,
    marginRight: 8
  },

  activeFilter: {
    backgroundColor: "#38bdf8"
  },

  filterText: {
    color: "white"
  },

  card: {
    marginVertical: 15
  },

  input: {
    backgroundColor: "#334155",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: "white"
  },

  addBtn: {
    backgroundColor: "#38bdf8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },

  btnText: {
    color: "white"
  },

  itemCard: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 10,
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

  editBtn: {
    backgroundColor: "#facc15",
    padding: 8,
    borderRadius: 6
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: 8,
    borderRadius: 6
  },

  modalBg: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },

  modalCard: {
    backgroundColor: "#1e293b",
    margin: 20,
    padding: 20,
    borderRadius: 12
  }

});