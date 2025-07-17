import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

// Types for authentication
interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  companyName?: string;
}

export default function ProfileScreen() {
  const { user, isLoading, error, login, logout, signup } = useAppContext();
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: ''
  });

  // Memoize validation functions to prevent unnecessary re-renders
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validateLoginForm = useCallback(() => {
    if (!loginForm.email || !loginForm.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!validateEmail(loginForm.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  }, [loginForm.email, loginForm.password, validateEmail]);

  const validateSignupForm = useCallback(() => {
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }
    if (!validateEmail(signupForm.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (signupForm.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  }, [signupForm, validateEmail]);

  // Authentication handlers
  const handleLogin = useCallback(async () => {
    if (!validateLoginForm()) return;
    
    setAuthLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      const errorMessage = (error instanceof Error && error.message) ? error.message : 'Please check your credentials';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setAuthLoading(false);
    }
  }, [validateLoginForm, login, loginForm.email, loginForm.password]);

  const handleSignup = useCallback(async () => {
    if (!validateSignupForm()) return;
    
    setAuthLoading(true);
    try {
      await signup({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        phone: signupForm.phone,
        companyName: signupForm.companyName
      });
      setShowSignupModal(false);
      setSignupForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        companyName: ''
      });
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Signup Failed', (error instanceof Error && error.message) ? error.message : 'Please try again');
    } finally {
      setAuthLoading(false);
    }
  }, [validateSignupForm, signup, signupForm]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('Success', 'Logged out successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  }, [logout]);

  // Profile menu handlers
  const handleEditProfile = useCallback(() => {
    Alert.alert('Edit Profile', 'This feature would allow editing your profile information.');
  }, []);

  const handleAddresses = useCallback(() => {
    Alert.alert('Addresses', 'This feature would allow managing your shipping addresses.');
  }, []);

  const handleSettings = useCallback(() => {
    Alert.alert('Settings', 'This feature would allow changing app settings and preferences.');
  }, []);

  const handleHelp = useCallback(() => {
    Alert.alert('Help & Support', 'This feature would provide customer support options.');
  }, []);

  const handleOrdersNavigation = useCallback(() => {
    router.navigate({
      pathname: '/(tabs)/order',
    });
  }, [router]);

  // Optimized input handlers with proper event handling
  const handleLoginEmailChange = useCallback((text: string) => {
    setLoginForm(prev => ({ ...prev, email: text }));
  }, []);

  const handleLoginPasswordChange = useCallback((text: string) => {
    setLoginForm(prev => ({ ...prev, password: text }));
  }, []);

  const handleSignupNameChange = useCallback((text: string) => {
    setSignupForm(prev => ({ ...prev, name: text }));
  }, []);

  const handleSignupEmailChange = useCallback((text: string) => {
    setSignupForm(prev => ({ ...prev, email: text }));
  }, []);

  const handleSignupPhoneChange = useCallback((text: string) => {
    setSignupForm(prev => ({ ...prev, phone: text }));
  }, []);

  const handleSignupCompanyChange = useCallback((text: string) => {
    setSignupForm(prev => ({ ...prev, companyName: text }));
  }, []);

  const handleSignupPasswordChange = useCallback((text: string) => {
    setSignupForm(prev => ({ ...prev, password: text }));
  }, []);

  const handleSignupConfirmPasswordChange = useCallback((text: string) => {
    setSignupForm(prev => ({ ...prev, confirmPassword: text }));
  }, []);

  // Modal handlers
  const openLoginModal = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const openSignupModal = useCallback(() => {
    setShowSignupModal(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const closeSignupModal = useCallback(() => {
    setShowSignupModal(false);
  }, []);

  const switchToSignup = useCallback(() => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  }, []);

  const switchToLogin = useCallback(() => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  }, []);

  // Memoize styles to prevent unnecessary re-renders
  const dynamicStyles = useMemo(() => ({
    container: [styles.container, { backgroundColor: colors.background }],
    modalContainer: [styles.modalContainer, { backgroundColor: colors.background }],
    modalHeaderBorder: { borderBottomColor: colors.lightGray },
    input: [styles.input, { borderColor: colors.lightGray, color: colors.text }],
    authButton: [styles.authButton, { backgroundColor: colors.primary }],
    guestAuthButton: [styles.guestAuthButton, { backgroundColor: colors.primary }],
    logoutButton: [styles.logoutButton, { backgroundColor: colors.danger }],
    menuItem: [styles.menuItem, { borderBottomColor: colors.lightGray }],
    editButton: [styles.editButton, { backgroundColor: colors.lightGray }],
    avatarContainer: [styles.avatarContainer, { backgroundColor: colors.primary }],
    guestIcon: [styles.guestIcon, { backgroundColor: colors.lightGray }],
  }), [colors]);

  // Login Modal Component - Memoized to prevent unnecessary re-renders
  const LoginModal = useMemo(() => (
    <Modal
      visible={showLoginModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeLoginModal}
    >
      <SafeAreaView style={dynamicStyles.modalContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          <View style={[styles.modalHeader, dynamicStyles.modalHeaderBorder]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Login</Text>
            <TouchableOpacity onPress={closeLoginModal}>
              <Text style={[styles.closeButton, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Email"
              placeholderTextColor={colors.darkGray}
              value={loginForm.email}
              onChangeText={handleLoginEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <TextInput
              style={dynamicStyles.input}
              placeholder="Password"
              placeholderTextColor={colors.darkGray}
              value={loginForm.password}
              onChangeText={handleLoginPasswordChange}
              secureTextEntry
              autoCorrect={false}
              autoComplete="password"
            />

            <TouchableOpacity
              style={dynamicStyles.authButton}
              onPress={handleLogin}
              disabled={authLoading}
              activeOpacity={0.8}
            >
              {authLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.authButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchAuthButton}
              onPress={switchToSignup}
              activeOpacity={0.8}
            >
              <Text style={[styles.switchAuthText, { color: colors.primary }]}>
                Don't have an account? Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  ), [showLoginModal, colors, loginForm, authLoading, handleLogin, handleLoginEmailChange, handleLoginPasswordChange, closeLoginModal, switchToSignup, dynamicStyles]);

  // Signup Modal Component - Memoized to prevent unnecessary re-renders
  const SignupModal = useMemo(() => (
    <Modal
      visible={showSignupModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeSignupModal}
    >
      <SafeAreaView style={dynamicStyles.modalContainer}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          <View style={[styles.modalHeader, dynamicStyles.modalHeaderBorder]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Sign Up</Text>
            <TouchableOpacity onPress={closeSignupModal}>
              <Text style={[styles.closeButton, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.formContainer} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              style={dynamicStyles.input}
              placeholder="Full Name *"
              placeholderTextColor={colors.darkGray}
              value={signupForm.name}
              onChangeText={handleSignupNameChange}
              autoCorrect={false}
              autoComplete="name"
            />

            <TextInput
              style={dynamicStyles.input}
              placeholder="Email *"
              placeholderTextColor={colors.darkGray}
              value={signupForm.email}
              onChangeText={handleSignupEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <TextInput
              style={dynamicStyles.input}
              placeholder="Phone Number"
              placeholderTextColor={colors.darkGray}
              value={signupForm.phone}
              onChangeText={handleSignupPhoneChange}
              keyboardType="phone-pad"
              autoCorrect={false}
              autoComplete="tel"
            />

            <TextInput
              style={dynamicStyles.input}
              placeholder="Company Name"
              placeholderTextColor={colors.darkGray}
              value={signupForm.companyName}
              onChangeText={handleSignupCompanyChange}
              autoCorrect={false}
            />

            <TextInput
              style={dynamicStyles.input}
              placeholder="Password *"
              placeholderTextColor={colors.darkGray}
              value={signupForm.password}
              onChangeText={handleSignupPasswordChange}
              secureTextEntry
              autoCorrect={false}
              autoComplete="password-new"
            />

            <TextInput
              style={dynamicStyles.input}
              placeholder="Confirm Password *"
              placeholderTextColor={colors.darkGray}
              value={signupForm.confirmPassword}
              onChangeText={handleSignupConfirmPasswordChange}
              secureTextEntry
              autoCorrect={false}
              autoComplete="password-new"
            />

            <TouchableOpacity
              style={dynamicStyles.authButton}
              onPress={handleSignup}
              disabled={authLoading}
              activeOpacity={0.8}
            >
              {authLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.authButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchAuthButton}
              onPress={switchToLogin}
              activeOpacity={0.8}
            >
              <Text style={[styles.switchAuthText, { color: colors.primary }]}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  ), [showSignupModal, colors, signupForm, authLoading, handleSignup, handleSignupNameChange, handleSignupEmailChange, handleSignupPhoneChange, handleSignupCompanyChange, handleSignupPasswordChange, handleSignupConfirmPasswordChange, closeSignupModal, switchToLogin, dynamicStyles]);

  // Guest view (when user is not logged in) - Memoized
  const GuestView = useMemo(() => (
    <View style={styles.guestContainer}>
      <View style={dynamicStyles.guestIcon}>
        <Text style={[styles.guestIconText, { color: colors.darkGray }]}>👤</Text>
      </View>
      <Text style={[styles.guestTitle, { color: colors.text }]}>Welcome to Ceekay Enterprise</Text>
      <Text style={[styles.guestSubtitle, { color: colors.darkGray }]}>
        Please login or create an account to access your profile and orders
      </Text>
      
      <TouchableOpacity
        style={dynamicStyles.guestAuthButton}
        onPress={openLoginModal}
        activeOpacity={0.8}
      >
        <Text style={styles.guestAuthButtonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={dynamicStyles.guestAuthButton}
        onPress={openSignupModal}
        activeOpacity={0.8}
      >
        <Text style={styles.guestAuthButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  ), [colors, dynamicStyles, openLoginModal, openSignupModal]);

  // User profile view - Memoized
  const UserProfileView = useMemo(() => {
    if (!user) return null;
    
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={dynamicStyles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: colors.darkGray }]}>{user.email}</Text>
          {user.companyName && (
            <Text style={[styles.userCompany, { color: colors.darkGray }]}>{user.companyName}</Text>
          )}

          <TouchableOpacity 
            style={dynamicStyles.editButton}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <Text style={[styles.editButtonText, { color: colors.text }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>

          <TouchableOpacity 
            style={dynamicStyles.menuItem}
            onPress={handleOrdersNavigation}
            activeOpacity={0.8}
          >
            <Text style={[styles.menuItemText, { color: colors.text }]}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={dynamicStyles.menuItem}
            onPress={handleAddresses}
            activeOpacity={0.8}
          >
            <Text style={[styles.menuItemText, { color: colors.text }]}>Shipping Addresses</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={dynamicStyles.menuItem}
            onPress={handleSettings}
            activeOpacity={0.8}
          >
            <Text style={[styles.menuItemText, { color: colors.text }]}>Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>

          <TouchableOpacity 
            style={dynamicStyles.menuItem}
            onPress={handleHelp}
            activeOpacity={0.8}
          >
            <Text style={[styles.menuItemText, { color: colors.text }]}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={dynamicStyles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }, [user, colors, dynamicStyles, handleEditProfile, handleOrdersNavigation, handleAddresses, handleSettings, handleHelp, handleLogout]);

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={dynamicStyles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : user ? (
        UserProfileView
      ) : (
        GuestView
      )}

      {LoginModal}
      {SignupModal}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 5,
  },
  userCompany: {
    fontSize: 14,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutButton: {
    margin: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // Guest view styles
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  guestIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  guestIconText: {
    fontSize: 40,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  guestSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  guestAuthButton: {
    width: '100%',
    maxWidth: 280,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  guestAuthButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    paddingTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  authButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchAuthButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  switchAuthText: {
    fontSize: 16,
  },
});