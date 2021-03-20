import { Telegraf, Markup } from 'telegraf';
import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import { parseTransaction } from './parser/parseTransaction';
import { Transaction } from './types';
import { getStats } from './stats/getStats';

require('dotenv').config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const startBot = (token: string) => {
  const bot = new Telegraf(token);

  bot.hears(/add/gi, async (ctx) => {
    const {
      update: { message },
    } = ctx;

    const action = parseTransaction(message.text.replace('add', '').trim());
    const { amount, currency, tag } = action;

    await db.collection('transaction').add({
      id: uuid(),
      username: message.from.username,
      ...action,
      createdAt: new Date(),
    });

    const transactionType = amount > 0 ? 'income' : 'expenses';

    ctx.reply(`${amount} ${currency} added as ${tag} ${transactionType}`);
  });

  // bot.on('text', async (ctx) => {
  //   const {
  //     update: { message },
  //   } = ctx;

  //   await db.collection('messages').doc(message.text).update({
  //     text: 'Updated message',
  //   });

  //   // if (message.text.indexOf('delete message') > -1) {

  //   //   await db
  //   //     .collection('messages')
  //   //     .doc(`${message.text.split(' ')[2]}`)
  //   //     .delete();
  //   // }

  //   // const docRef = await db.collection('messages').add({
  //   //   username: message.from.username,
  //   //   text: message.text,
  //   // });

  //   ctx.reply(`message is updated`);
  // });

  bot.hears(/\/del[a-zA-z0-9]/gi, async (ctx) => {
    const transactionId = ctx.message.text.replace('/del', '');

    await db.collection('transaction').doc(transactionId).delete();

    ctx.reply(`${transactionId} transaction is deleted`);
  });

  bot.command('/transactions', async (ctx) => {
    const username = ctx.update.message.from.username;

    if (username) {
      const documentData = await db
        .collection('transaction')
        .where('username', '==', username)
        .get();

      const transactions = documentData.docs.map((doc, index) => {
        const { tag, description, amount, currency } = doc.data() as Transaction;

        return `${index + 1}) ${amount} ${currency} ${tag} ${
          description ? `(${description})` : ''
        } | Delete ▶ /del${doc.id}`;
      });

      if (transactions.length) {
        return ctx.reply(transactions.join('\n'));
      }

      return ctx.reply(`You don't have added transactions!`);
    }
  });

  bot.command('stats', async (ctx) => {
    const { from, text } = ctx.update.message;
    const username = from.username;
    const [, start, end] = text.split(' ');

    let documentData: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData> | null = null;

    if (start || end) {
      const startDate = Date.parse(start);
      const endDate = Date.parse(end);

      if (startDate && endDate) {
        documentData = await db
          .collection('transaction')
          .where('createdAt', '>=', new Date(startDate))
          .where('createdAt', '<=', new Date(endDate))
          .get();
      } else {
        documentData = await db
          .collection('transaction')
          .where('createdAt', '>=', new Date(startDate))
          .get();
      }
    } else {
      documentData = await db.collection('transaction').where('username', '==', username).get();
    }

    const transactions = documentData.docs.map((doc) => doc.data() as Transaction);

    const stats = getStats(transactions);
    const statsByCategory = Object.entries(stats.transactions)
      .map(([category, stat]) => `${category}: \n↑ ${stat.totalIncome}\n↓ ${stat.totalExpenses}\n`)
      .join('\n');

    return ctx.reply(`${statsByCategory}\n\n↑ Income: ${stats.income}\n↓ Expenses: ${stats.expenses}
    `);
  });

  bot.launch();
};

if (botToken) {
  startBot(botToken);
} else {
  throw Error('Please, fill out TELEGRAM_BOT_TOKEN key in .env file');
}
