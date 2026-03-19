import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../../stores/authStore';
import { RootStackParamList } from '../../types';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights, Shadows } from '../../theme';
import { InputField, PrimaryButton } from '../../components/ui';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login, sendOtp, isLoading, error, clearError } = useAuthStore();

  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await login(email.trim(), password);
    } catch {
      // Error handled in store
    }
  };

  const handlePhoneLogin = async () => {
    const cleaned = phone.replace(/\s+/g, '').replace(/^0+/, '');
    if (cleaned.length < 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    // Normalize to +91 format
    const normalized = cleaned.startsWith('+91')
      ? cleaned
      : cleaned.startsWith('91') && cleaned.length > 10
      ? `+${cleaned}`
      : `+91${cleaned}`;

    setIsSendingOtp(true);
    try {
      await sendOtp(normalized);
      navigation.navigate('OtpVerify', {phone: normalized});
    } catch {
      // Error handled in store
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgOrb1} />
      <View style={styles.bgOrb2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Brand Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoDot} />
              <Text style={styles.logoText}>overline</Text>
            </View>
            <Text style={styles.tagline}>Book. Arrive. Shine.</Text>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome{'\n'}back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue your beauty journey
            </Text>
          </View>

          {/* Login Mode Toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeButton, loginMode === 'phone' && styles.modeButtonActive]}
              onPress={() => { setLoginMode('phone'); clearError(); }}>
              <Text style={[styles.modeText, loginMode === 'phone' && styles.modeTextActive]}>
                Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, loginMode === 'email' && styles.modeButtonActive]}
              onPress={() => { setLoginMode('email'); clearError(); }}>
              <Text style={[styles.modeText, loginMode === 'email' && styles.modeTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error && (
              <TouchableOpacity
                style={styles.errorContainer}
                onPress={clearError}
                activeOpacity={0.8}>
                <Text style={styles.errorIcon}>{'⚠️'}</Text>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.dismissError}>{'✕'}</Text>
              </TouchableOpacity>
            )}

            {loginMode === 'phone' ? (
              <>
                <InputField
                  label="Phone Number"
                  icon="{'📱'}"
                  placeholder="Enter your 10-digit number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={13}
                />

                <PrimaryButton
                  title={isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
                  onPress={handlePhoneLogin}
                  loading={isSendingOtp}
                  icon={'🔐'}
                  style={{ marginTop: Spacing.md }}
                />

                <View style={styles.otpInfoBox}>
                  <Text style={styles.otpInfoIcon}>{'🛡️'}</Text>
                  <Text style={styles.otpInfoText}>
                    We'll send a 6-digit verification code to your phone number for secure login
                  </Text>
                </View>
              </>
            ) : (
              <>
                <InputField
                  label="Email"
                  icon={'✉️'}
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <View>
                  <InputField
                    label="Password"
                    icon={'🔑'}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.eyeText}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotButton}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <PrimaryButton
                  title="Sign In"
                  onPress={handleEmailLogin}
                  loading={isLoading}
                  icon={'→'}
                  style={{ marginTop: Spacing.md }}
                />
              </>
            )}

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social login */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Overline? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bgOrb1: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(108, 92, 231, 0.08)',
  },
  bgOrb2: {
    position: 'absolute',
    bottom: 100,
    left: -120,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 210, 255, 0.05)',
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing['2xl'],
    paddingTop: height * 0.08,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginRight: Spacing.sm,
    ...Shadows.glow,
  },
  logoText: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.extrabold,
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  welcomeSection: {
    marginBottom: Spacing['3xl'],
  },
  welcomeTitle: {
    fontSize: FontSizes.hero,
    fontWeight: FontWeights.extrabold,
    color: Colors.textPrimary,
    lineHeight: 56,
    marginBottom: Spacing.md,
  },
  welcomeSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    marginBottom: Spacing['3xl'],
  },
  errorContainer: {
    backgroundColor: Colors.errorLight,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  errorIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  errorText: {
    color: Colors.error,
    flex: 1,
    fontSize: FontSizes.sm,
  },
  dismissError: {
    color: Colors.error,
    fontWeight: FontWeights.bold,
    paddingLeft: Spacing.sm,
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 42,
  },
  eyeText: {
    fontSize: 18,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
    marginTop: -Spacing.md,
  },
  forgotText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing['2xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
    marginHorizontal: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  socialText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: Spacing['4xl'],
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.md,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing['2xl'],
  },
  modeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  modeText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textTertiary,
  },
  modeTextActive: {
    color: '#fff',
  },
  otpInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  otpInfoIcon: {
    fontSize: 18,
  },
  otpInfoText: {
    flex: 1,
    color: Colors.textTertiary,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
});
