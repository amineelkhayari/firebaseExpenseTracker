// import { View, Text,StyleSheet, FlatList, TouchableOpacity } from 'react-native'
// import React from 'react'
// interface Props{
//     expGrouped:GroupedData
// }
// const list = (props:Props) => {
//     const {expGrouped} = props

//     const renderItem = ({ item }: { item: GroupedData }) => (
//         <View style={styles.group}>
//           <View style={{ alignItems: 'center', backgroundColor: "#0101" }}>
//             <Text style={[styles.date, { alignItems: 'baseline' }]}>{item.date}</Text>
//             <Text style={{}}>Exp: {item?.exp?.Expense} | Credit: {item?.exp?.Credit} | Debts: {item?.exp?.Debts}</Text>
//           </View>
//           <FlatList
//             data={item.data}
//             keyExtractor={(transaction) => transaction.transaction}
//             renderItem={({ item: transaction }) => (
//               <>
//                 <TouchableOpacity
//                   key={transaction.transaction}
//                   onPress={() => {
//                     router.push(
//                       {
//                         pathname: 'Screens/Detail', params: { id: transaction.transaction }
//                       }
//                     )
//                   }}>
//                   <Text style={{ fontWeight: 'bold' }}> + Payed By: {transaction.paidBy}</Text>
    
//                   <View style={[styles.transaction, { backgroundColor: transaction.paidBy === selectUser ? "green" : "grey" }]}>
//                     <View>
//                       <Text style={{ fontWeight: 'bold' }}>{transaction.description}</Text>
//                       <Text>Amount: {transaction.amount}</Text>
//                     </View>
//                     <View>
//                       <Text>Parts: {transaction.participants.length}</Text>
//                       <Text>Amount: {(transaction.amount / transaction.participants.length).toFixed(2)}/ {transaction.amount}</Text>
//                     </View>
    
//                   </View>
    
//                 </TouchableOpacity>
//                 <View style={styles.div} />
    
//               </>
    
//             )}
//           />
//           <View style={styles.divider} />
    
//         </View>
//       );
    
//   return (
//     <View >
//       <Text style={{ justifyContent: 'center', fontSize: 20, fontWeight: 'bold' }}>All Expenses For User : {selectUser}</Text>
//       <FlatList
//         data={expGrouped}
//         keyExtractor={(group) => group.date}
//         renderItem={renderItem}
//       />
//     </View>
//   )
// }

// export default list

// const styles = StyleSheet.create({
//     div: {
//       height: 1, // Adjust height as needed
//       backgroundColor: 'gray', // Adjust color as needed
//       marginVertical: 10, // Adjust vertical spacing as needed
//     },
//     divider: {
//       height: 3, // Adjust height as needed
//       backgroundColor: 'red', // Adjust color as needed
//       marginVertical: 10, // Adjust vertical spacing as needed
//     },
//     container: {
//       flex: 1,
//       backgroundColor: '#ffffff',
//     },
//     group: {
//       marginBottom: 20,
//       paddingHorizontal: 20,
//     },
//     date: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginBottom: 10,
//       color: '#333',
//     },
//     transaction: {
//       padding: 15,
//       backgroundColor: '#f9f9f9',
//       borderRadius: 8,
//       marginBottom: 10,
//       shadowColor: '#000',
//       flexDirection: 'row',
//       justifyContent: 'space-around',
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//       shadowOpacity: 0.25,
//       shadowRadius: 3.84,
//       elevation: 5,
//     },
//     description: {
//       fontSize: 16,
//       marginBottom: 5,
//       color: '#333',
//     },
//     amount: {
//       fontSize: 14,
//       color: '#666',
//     }
//   });
  