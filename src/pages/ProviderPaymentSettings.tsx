
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CreditCard, CheckCircle, Plus, Edit, Trash, Clock, Upload, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Define types for payment settings
interface BankAccount {
  id: string;
  bankName: string;
  accountType: "checking" | "savings";
  accountNumber: string;
  routingNumber: string;
  isDefault: boolean;
  status: "verified" | "pending" | "failed";
}

interface PaymentMethod {
  id: string;
  type: "credit_card" | "bank_account" | "paypal";
  provider?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "payout" | "payment" | "refund" | "fee";
  status: "completed" | "pending" | "failed";
  description: string;
  reference?: string;
}

interface PayoutSettings {
  frequency: "weekly" | "biweekly" | "monthly";
  minimumAmount: number;
  automaticPayouts: boolean;
  payoutMethod: string;
}

interface TaxInformation {
  taxId: string;
  taxIdType: "ssn" | "ein";
  businessName?: string;
  w9Submitted: boolean;
  submitDate?: string;
}

// Mock data for payment settings
const mockBankAccounts: BankAccount[] = [
  {
    id: "ba1",
    bankName: "Chase Bank",
    accountType: "checking",
    accountNumber: "****5678",
    routingNumber: "****4321",
    isDefault: true,
    status: "verified"
  },
  {
    id: "ba2",
    bankName: "Bank of America",
    accountType: "savings",
    accountNumber: "****1234",
    routingNumber: "****8765",
    isDefault: false,
    status: "verified"
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm1",
    type: "credit_card",
    provider: "Visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2027,
    isDefault: true
  },
  {
    id: "pm2",
    type: "paypal",
    provider: "PayPal",
    isDefault: false
  }
];

const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    date: "2025-05-12",
    amount: 250.00,
    type: "payout",
    status: "completed",
    description: "Weekly payout to Chase Bank ****5678",
    reference: "PO-123456"
  },
  {
    id: "tx2",
    date: "2025-05-05",
    amount: 190.00,
    type: "payout",
    status: "completed",
    description: "Weekly payout to Chase Bank ****5678",
    reference: "PO-123455"
  },
  {
    id: "tx3",
    date: "2025-05-01",
    amount: 45.00,
    type: "fee",
    status: "completed",
    description: "Monthly subscription fee",
    reference: "SUB-78901"
  },
  {
    id: "tx4",
    date: "2025-04-28",
    amount: 210.00,
    type: "payout",
    status: "completed",
    description: "Weekly payout to Chase Bank ****5678",
    reference: "PO-123454"
  },
];

const mockPayoutSettings: PayoutSettings = {
  frequency: "weekly",
  minimumAmount: 50,
  automaticPayouts: true,
  payoutMethod: "ba1"
};

const mockTaxInformation: TaxInformation = {
  taxId: "***-**-5678",
  taxIdType: "ein",
  businessName: "Pro Painters Inc.",
  w9Submitted: true,
  submitDate: "2025-01-15"
};

export default function ProviderPaymentSettings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("payment-methods");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>(mockPayoutSettings);
  const [editingPayoutSettings, setEditingPayoutSettings] = useState(false);

  // Handle setting default bank account
  const setDefaultBankAccount = (id: string) => {
    setBankAccounts(accounts => 
      accounts.map(account => ({
        ...account,
        isDefault: account.id === id
      }))
    );
    
    toast({
      title: "Default Account Updated",
      description: "Your default payout account has been updated"
    });
  };

  // Handle deleting bank account
  const deleteBankAccount = (id: string) => {
    // Don't allow deleting the default account
    const account = bankAccounts.find(a => a.id === id);
    if (account?.isDefault) {
      toast({
        title: "Cannot Delete Default Account",
        description: "Please set another account as default before deleting this one",
        variant: "destructive"
      });
      return;
    }
    
    setBankAccounts(accounts => accounts.filter(account => account.id !== id));
    toast({
      title: "Account Removed",
      description: "Bank account has been removed from your profile"
    });
  };

  // Handle setting default payment method
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    
    toast({
      title: "Default Payment Method Updated",
      description: "Your default payment method has been updated"
    });
  };

  // Handle deleting payment method
  const deletePaymentMethod = (id: string) => {
    // Don't allow deleting the default payment method
    const method = paymentMethods.find(m => m.id === id);
    if (method?.isDefault) {
      toast({
        title: "Cannot Delete Default Payment Method",
        description: "Please set another method as default before deleting this one",
        variant: "destructive"
      });
      return;
    }
    
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    toast({
      title: "Payment Method Removed",
      description: "Payment method has been removed from your profile"
    });
  };

  // Handle saving payout settings
  const savePayoutSettings = () => {
    // In a real app, this would make an API call to save the settings
    setEditingPayoutSettings(false);
    toast({
      title: "Payout Settings Saved",
      description: "Your payout preferences have been updated"
    });
  };

  return (
    <div className="min-h-screen bg-hustlr-light-gray">
      <AppHeader />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/provider/profile')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Payment Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="payment-methods">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="payout-settings">Payout Settings</TabsTrigger>
            <TabsTrigger value="transaction-history">Transaction History</TabsTrigger>
            <TabsTrigger value="tax-information">Tax Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payment-methods" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>Manage your bank accounts for receiving payments</CardDescription>
              </CardHeader>
              <CardContent>
                {bankAccounts.length > 0 ? (
                  <div className="space-y-4">
                    {bankAccounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold">{account.bankName}</h3>
                            {account.isDefault && (
                              <Badge variant="outline" className="ml-2">Default</Badge>
                            )}
                            <Badge variant="outline" className={`ml-2 ${
                              account.status === 'verified' ? 'bg-green-50 text-green-700' :
                              account.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                              'bg-red-50 text-red-700'
                            }`}>
                              {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} • 
                            {account.accountNumber}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!account.isDefault && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setDefaultBankAccount(account.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteBankAccount(account.id)}
                            disabled={account.isDefault}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-gray-500">No bank accounts added yet</p>
                  </div>
                )}
                
                <Button onClick={() => navigate("/provider/add-bank-account")} className="mt-4">
                  <Plus className="h-4 w-4 mr-1" /> Add Bank Account
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your payment methods for subscriptions and fees</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethods.length > 0 ? (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <div className="flex items-center">
                            {method.type === 'credit_card' && <CreditCard className="h-5 w-5 mr-2" />}
                            <h3 className="font-semibold">
                              {method.type === 'credit_card' ? `${method.provider} ****${method.last4}` : method.provider}
                            </h3>
                            {method.isDefault && (
                              <Badge variant="outline" className="ml-2">Default</Badge>
                            )}
                          </div>
                          {method.type === 'credit_card' && method.expMonth && method.expYear && (
                            <p className="text-sm text-gray-600 mt-1">
                              Expires {method.expMonth}/{method.expYear}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!method.isDefault && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setDefaultPaymentMethod(method.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deletePaymentMethod(method.id)}
                            disabled={method.isDefault}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-gray-500">No payment methods added yet</p>
                  </div>
                )}
                
                <Button onClick={() => navigate("/provider/add-payment-method")} className="mt-4">
                  <Plus className="h-4 w-4 mr-1" /> Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payout-settings" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payout Preferences</CardTitle>
                  <CardDescription>Configure how and when you receive your earnings</CardDescription>
                </div>
                {!editingPayoutSettings ? (
                  <Button onClick={() => setEditingPayoutSettings(true)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit Settings
                  </Button>
                ) : (
                  <Button onClick={savePayoutSettings} className="bg-green-600 hover:bg-green-700">
                    <CheckCheck className="h-4 w-4 mr-1" /> Save Changes
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Payout Frequency</h3>
                    <RadioGroup 
                      value={payoutSettings.frequency}
                      onValueChange={(value) => setPayoutSettings({...payoutSettings, frequency: value as any})}
                      disabled={!editingPayoutSettings}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Weekly (every Monday)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="biweekly" id="biweekly" />
                        <Label htmlFor="biweekly">Biweekly (every other Monday)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly (1st of each month)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Minimum Payout Amount</h3>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input 
                        type="number" 
                        value={payoutSettings.minimumAmount} 
                        onChange={(e) => setPayoutSettings({...payoutSettings, minimumAmount: Number(e.target.value)})}
                        disabled={!editingPayoutSettings}
                        className="max-w-[100px]"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Earnings below this amount will roll over to the next payout period
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Automatic Payouts</h3>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="automatic-payouts" 
                        checked={payoutSettings.automaticPayouts}
                        onCheckedChange={(checked) => setPayoutSettings({...payoutSettings, automaticPayouts: checked})}
                        disabled={!editingPayoutSettings}
                      />
                      <Label htmlFor="automatic-payouts">Enable automatic payouts</Label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      When enabled, your earnings will be automatically transferred to your default bank account
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Default Payout Method</h3>
                    <select 
                      value={payoutSettings.payoutMethod}
                      onChange={(e) => setPayoutSettings({...payoutSettings, payoutMethod: e.target.value})}
                      disabled={!editingPayoutSettings}
                      className="w-full p-2 border rounded-md"
                    >
                      {bankAccounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.bankName} ({account.accountType}) - {account.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transaction-history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Review your past transactions and payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 border rounded-md flex justify-between items-center">
                      <div>
                        <div className="flex items-center">
                          {transaction.type === 'payout' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                          {transaction.type === 'fee' && <Clock className="h-4 w-4 text-orange-500 mr-2" />}
                          <p className="font-medium">{transaction.description}</p>
                        </div>
                        <div className="flex items-center mt-1">
                          <p className="text-sm text-gray-500 mr-4">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            Ref: {transaction.reference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'payout' ? 'text-green-600' : 'text-orange-600'}`}>
                          {transaction.type === 'payout' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                        <Badge 
                          variant="outline" 
                          className={`mt-1 ${
                            transaction.status === 'completed' ? 'bg-green-50 text-green-700' : 
                            transaction.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-red-50 text-red-700'
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  View All Transactions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tax-information" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
                <CardDescription>Manage your tax details for proper reporting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium">Tax ID</h3>
                    <p>{mockTaxInformation.taxId}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {mockTaxInformation.taxIdType === 'ein' ? 'Employer Identification Number' : 'Social Security Number'}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  {mockTaxInformation.businessName && (
                    <div>
                      <h3 className="font-medium">Business Name</h3>
                      <p>{mockTaxInformation.businessName}</p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium">W-9 Form</h3>
                    {mockTaxInformation.w9Submitted ? (
                      <div className="mt-1">
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Submitted on {new Date(mockTaxInformation.submitDate!).toLocaleDateString()}</span>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Upload className="h-4 w-4 mr-1" /> Upload New Form
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <p className="text-orange-600 mb-2">
                          You need to submit a W-9 form to receive payouts
                        </p>
                        <Button>
                          <Upload className="h-4 w-4 mr-1" /> Upload W-9 Form
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
