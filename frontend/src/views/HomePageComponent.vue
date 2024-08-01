<template>
  <v-app>
    <div class="container">
      <!-- The search form -->
      <div class="search-bar">
        <v-text-field
          v-model="searchQuery"
          label="Search contacts..."
          @input="searchContacts"
          outlined
        ></v-text-field>
      </div>

      <!-- The contact form -->
      <v-form ref="form" v-model="valid">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="newContact.name"
              :rules="nameRules"
              label="Name"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="newContact.phone"
              :rules="phoneRules"
              label="Phone"
              required
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="newContact.email"
              :rules="emailRules"
              label="Email"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn @click="addContact" :disabled="!valid">Add Contact</v-btn>
          </v-col>
        </v-row>
      </v-form>

      <!-- This is the contact grid -->
      <v-row>
        <v-col
          v-for="contact in filteredContacts"
          :key="contact.id"
          cols="12"
          sm="4"
        >
          <v-card>
            <v-card-title>{{ contact.name }}</v-card-title>
            <v-card-subtitle>{{ contact.phone }}</v-card-subtitle>
            <v-card-subtitle>{{ contact.email }}</v-card-subtitle>
            <v-card-actions>
              <v-btn icon @click="editContact(contact)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteContact(contact.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- The edit dialog that pops when clicking the edit button -->
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-title>Edit Contact</v-card-title>
          <v-card-text>
            <v-form ref="editForm" v-model="editValid">
              <v-text-field
                v-model="selectedContact.name"
                :rules="nameRules"
                label="Name"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="selectedContact.phone"
                :rules="phoneRules"
                label="Phone"
                required
                outlined
              ></v-text-field>
              <v-text-field
                v-model="selectedContact.email"
                :rules="emailRules"
                label="Email"
                outlined
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="updateContact" :disabled="!editValid">Update</v-btn>
            <v-btn @click="editDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

export default {
  data() {
    return {
      valid: false,
      editValid: false,
      contacts: [],
      newContact: { name: '', phone: '', email: '' },
      searchQuery: '',
      filteredContacts: [],
      editDialog: false,
      selectedContact: {},
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => (v && v.length >= 3) || 'Name must be at least 3 characters',
      ],
      phoneRules: [
        (v) => !!v || 'Phone is required',
        (v) => /^\d{11}$/.test(v) || 'Phone must be a valid 11-digit number',
      ],
      emailRules: [
        (v) => !v || /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v) || 'Email must be valid',
      ],
    };
  },
  created() {
    this.fetchContacts();
  },
  methods: {
    async fetchContacts() {
      try {
        const response = await axios.get('http://localhost:3000/contacts');
        this.contacts = response.data;
        this.filteredContacts = this.contacts;
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    },
    async addContact() {
      if (this.$refs.form.validate()) {
        try {
          const response = await axios.post('http://localhost:3000/contacts', this.newContact);
          this.contacts.push(response.data);
          this.filteredContacts = this.contacts;
          this.newContact = { name: '', phone: '', email: '' };
        } catch (error) {
          console.error('Error adding contact:', error);
        }
      }
    },
    async deleteContact(id) {
      try {
        await axios.delete(`http://localhost:3000/contacts/${id}`);
        this.contacts = this.contacts.filter((contact) => contact.id !== id);
        this.filteredContacts = this.contacts;
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    },
    editContact(contact) {
      this.selectedContact = { ...contact };
      this.editDialog = true;
    },
    async updateContact() {
      if (this.$refs.editForm.validate()) {
        try {
          await axios.put(`http://localhost:3000/contacts/${this.selectedContact.id}`, this.selectedContact);
          const index = this.contacts.findIndex((contact) => contact.id === this.selectedContact.id);
          if (index !== -1) {
            this.contacts.splice(index, 1, this.selectedContact);
          }
          this.filteredContacts = this.contacts;
          this.editDialog = false;
        } catch (error) {
          console.error('Error updating contact:', error);
        }
      }
    },
    searchContacts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredContacts = this.contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.phone.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query)
      );
    },
  },
  vuetify: new Vuetify(),
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f2f5;
}

.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 20px;
}
</style>
