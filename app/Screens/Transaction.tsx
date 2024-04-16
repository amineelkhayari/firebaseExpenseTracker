import { View, Text, SafeAreaView, StyleSheet, StatusBar, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../Interfaces/Firebase';
import { str } from '../Interfaces/Storage';
import { users } from '../Interfaces/Users';
import Dashboard from '../Components/Dashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { coupageGeneric } from '../Interfaces/Method';


const History = () => {

  const [selectedUser, setSelectedUser] = useState<string>('');

  const [Calculate, setCalculate] = useState<any>();
  const [expGrouped, setGrouped] = useState<GroupedData[]>([]);


  // Define a function to get the total debt for a specific user
  async function getTotalDebtForUser(userId: any) {
    try {
      let totalDebt = 0;
      let totleExpense = 0;
      let totalCredit = 0;

      ;      // Define start and end dates for the current month
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      // Format dates as strings
      const startOfMonthString = startOfMonth.toISOString();
      const endOfMonthString = endOfMonth.toISOString();

      const usersCollection = collection(db, 'users');

      const q = query(usersCollection,
        where('dateExp', '>=', startOfMonthString),
        where('dateExp', '<=', endOfMonthString)
      )


      // Get all users
      const querySnapshot = await getDocs(q);


      // Iterate over each expense
      querySnapshot.forEach((doc) => {

        const expense = doc.data();
        const amount = expense.amount;
        const paidBy = expense.paidBy;

        // Calculate Mohammed's share in the expense
        const participants = expense.participants;
        const numParticipants = participants.length;
        const share = amount / numParticipants;

        // If Mohammed is the payer, he's owed by other participants
        // If Mohammed is not the payer, he owes the payer
        if (paidBy === userId) {
          totleExpense += amount;
          participants.forEach((participant: Participants) => {
            if (participant.Value !== userId && !participant.Payed) {
              totalCredit += share;
            }
            else if (participant.Value !== userId && participant.Payed) {
              totleExpense -= share;

            }
          });
        } else {
          participants.forEach((participant: Participants) => {
            if (participant.Value == userId && !participant.Payed) {
              totalDebt += share;
            } else if (participant.Value == userId && participant.Payed)
              totleExpense += share;

          });
          //console.log(doc.data())

          //totalDebt += share;
        }
      });
      var res = {
        "Expense": totleExpense.toFixed(2),
        "Credit": totalCredit.toFixed(2),
        "Debts": totalDebt.toFixed(2)
      }


      return res;
    } catch (error) {
      //console.error('Error calculating total debt:', error);
      throw error;
    }
  }

  useEffect(() => {

    // Define start and end dates for the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // Format dates as strings
    const startOfMonthString = startOfMonth.toLocaleDateString();
    const endOfMonthString = endOfMonth.toLocaleDateString();

    const usersCollection = collection(db, 'users');

    const q = query(usersCollection,
      where('dateExp', '>=', startOfMonthString),
      where('dateExp', '<=', endOfMonthString)
    )

    const subscribe = onSnapshot(q, {
      next: async (snapshot) => {

        let totalDebt = 0;
        let totleExpense = 0;
        let totalCredit = 0;
        const todos: GetExpense[] = [];

        var value = await AsyncStorage.getItem('user');
        if (value == null)
          return;
        const Todos = snapshot.docs.forEach((doc) => {

          const expense = doc.data();
          const amount = expense.amount;
          const paidBy = expense.paidBy;

          // Calculate Mohammed's share in the expense
          const participants = expense.participants;
          const numParticipants = participants.length;
          const share = amount / numParticipants;

          // If Mohammed is the payer, he's owed by other participants
          // If Mohammed is not the payer, he owes the payer
          if (paidBy === value) {
            totleExpense += amount;
            participants.forEach((participant: Participants) => {
              if(participant.Value === value) 
                todos.push({
                id:doc.id,
                ...expense
              } as GetExpense);

              if (participant.Value !== value && !participant.Payed) {
                totalCredit += share;
              }
              else if (participant.Value !== value && participant.Payed) {
                totleExpense -= share;

              }
            });
          } else {
            participants.forEach((participant: Participants) => {
              if (participant.Value == value && !participant.Payed) {
                totalDebt += share;
              } else if (participant.Value == value && participant.Payed)
                {
                  totleExpense += share;
                todos.push({
                  id:doc.id,
                  ...expense
                } as GetExpense)
                }

            });
            //console.log(doc.data())

            //totalDebt += share;
          }


        });

        var res = {
          "Expense": totleExpense.toFixed(2),
          "Credit": totalCredit.toFixed(2),
          "Debts": totalDebt.toFixed(2)
        }
        //console.log("totale of Data",res)
        setGrouped(coupageGeneric(todos,'cat'))
        console.log(expGrouped);
        setCalculate(res);

      }
    })
    // Check if the user has already selected a user
    const checkUserSelection = async () => {
      try {
        const user = await str.getData('user', setSelectedUser);
        //alert(selectedUser)



      } catch (error) {
        // console.error('Error reading user selection:', error);
      }
    };

    checkUserSelection();
    return () => subscribe();


  }, []);

  if (selectedUser == "") {
    return (
      <View style={{ paddingTop: StatusBar.currentHeight }}>
        <Text>Select Your profile Pls: </Text>
        <View style={styles.usersSelect}>
          {
            users.map((item) => {
              return <View key={item.Value}>
                <Button title={item.Value} onPress={() => {
                  str.storeData("user", item.Value, setSelectedUser);
                }} />

              </View>

            })
          }
        </View>



      </View>
    );
  }

  return (
    <SafeAreaView style={{ paddingTop: StatusBar.currentHeight }}>
      <Button title='test' onPress={()=>{
        let double:number=0.0;
        console.log(double);
        double=Number("5.58888");
        console.log(Number("3.5"))
      }}/>
      <Button
        title='refrech' onPress={() => {
          getTotalDebtForUser(selectedUser)
            .then((data) => {
              //console.log(data)
              setCalculate(data)
            })
            .catch((error) => {
              //  console.error('Error:', error);
            });
        }} />
      <Dashboard
        CreditAmount={Calculate?.Credit}
        DebtAmount={Calculate?.Debts}
        ExpenseAmount={Calculate?.Expense}
      />
      {
        expGrouped.length!=0 && (
          expGrouped.map(item=>{
            return (
              <Text>{item.date}:{item.exp}</Text>
            )
          })
        )
      }

    </SafeAreaView>
  )
}

export default History

const styles = StyleSheet.create({
  usersSelect: {
    flexDirection: "row",
    justifyContent: 'space-between',
    gap: 10,
    top: 10,

  },
  container: {
    flex: 1,
    flexDirection: 'row', // Arrange buttons horizontally
    justifyContent: 'space-between', // Distribute space between buttons
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
