// 🟢 NUEVA VERSION: UI completamente desacoplada de la base de datos
 
import { useTodos } from "@/src/presentation/hooks/useTodos";
import { createStyles, defaultLightTheme, defaultDarkTheme } from "@/src/presentation/styles/Todos.styles";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
 
// 🟢 BENEFICIO: Este componente NO SABE si usamos SQLite, Firebase, o una API
// Solo sabe que puede llamar a addTodo, toggleTodo, deleteTodo
 
export default function TodosScreenClean() {
  const [inputText, setInputText] = useState("");
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useTodos();
 
  // 🎨 Detectar tema y crear estilos dinámicamente
  const colorScheme = useColorScheme();
  const styles = useMemo(
    () => createStyles(colorScheme === 'dark' ? defaultDarkTheme : defaultLightTheme),
    [colorScheme]
  );
 
  const handleAddTodo = async () => {
    if (!inputText.trim()) return;
 
    const success = await addTodo(inputText);
    if (success) {
      setInputText("");
    }
  };
 
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator
          size="large"
          color={colorScheme === 'dark' ? defaultDarkTheme.primary : defaultLightTheme.primary}
        />
        <Text style={styles.loadingText}>Cargando tareas...</Text>
      </View>
    );
  }
 
  const renderTodo = ({ item }: { item: any }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => toggleTodo(item.id)}
      >
        <View
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[styles.todoText, item.completed && styles.todoTextCompleted]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteTodo(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas (Clean)</Text>
 
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nueva tarea..."
          placeholderTextColor={colorScheme === 'dark' ? defaultDarkTheme.placeholder : defaultLightTheme.placeholder}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
 
      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
 
      <Text style={styles.footer}>
        Total: {todos.length} | Completadas:{" "}
        {todos.filter((t) => t.completed).length}
      </Text>
    </View>
  );
}