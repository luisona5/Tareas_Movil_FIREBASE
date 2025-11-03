import React, { useState } from "react"; 
import { View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert, 
    ActivityIndicator,
    KeyboardAvoidingView, 
    Platform, 
    ScrollView, 
} from "react-native"; 
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { useRouter } from "expo-router";


export default function LoginScreen() { 
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const { login, loading, error } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        const success = await login(email, password);
        if (success) {
            router.replace("/(tabs)/todos");
        } else {
            Alert.alert("Error", error || "Error al iniciar sesión");
        }   
    };

    const goToRegister = () => {
        router.push("/(tabs)/register");  
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <Text style={styles.title}>📝 TodoApp</Text>
                    <Text style={styles.subtitle}>Iniciar Sesión</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>


                <TouchableOpacity onPress={goToRegister}
                    style ={styles.linkButton}>
                    <Text style={styles.linkText}>
                        ¿No tienes una cuenta? 
                        <Text style={styles.linkTextBold}>Regístrate</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
},
scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
},
content: {
    padding: 20,
},
title: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
},
subtitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
    fontWeight: "600",
},
input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
},
button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
},
buttonDisabled: {
    backgroundColor: "#999",
},
buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
},
linkButton: {
    marginTop: 20,
    padding: 10,
},
linkText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",

},
linkTextBold: {
    fontWeight: "bold",
    color: "#007AFF",   
},
});
