// models/report.js
import { getFirestore } from '../utils/firestore.js';
import { customAlphabet } from 'nanoid';

const generateId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 16);

class Report {
  constructor(data) {
    this.id = data.id;
    this.kebun = data.kebun;
    this.afdeling = data.afdeling;
    this.blok = data.blok;
    this.koordinatX = data.koordinatX;
    this.koordinatY = data.koordinatY;
    this.nomorPP = data.nomorPP;
    this.estimasiSerangga = data.estimasiSerangga;
    this.tanggal = data.tanggal;
    this.waktu = data.waktu;
    this.kondisiCuaca = data.kondisiCuaca;
    this.rbt = data.rbt;
    this.imageUrl = data.imageUrl;
    
    // Handle createdBy as object or string
    if (typeof data.createdBy === 'object' && data.createdBy !== null) {
      this.createdBy = {
        id: data.createdBy.id || 'anonymous',
        name: data.createdBy.name || 'Unknown User',
        email: data.createdBy.email || null
      };
    } else {
      this.createdBy = {
        id: data.createdBy || 'anonymous',
        name: 'Unknown User',
        email: null
      };
    }
    
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static getCollection() {
    const db = getFirestore();
    return db.collection('report');
  }

  static async create(data) {
    const id = generateId();
    
    // Handle createdBy properly
    let createdByData;
    if (typeof data.createdBy === 'object' && data.createdBy !== null) {
      createdByData = {
        id: data.createdBy.id || 'anonymous',
        name: data.createdBy.name || 'Unknown User',
        email: data.createdBy.email || null
      };
    } else {
      createdByData = {
        id: data.createdBy || 'anonymous',
        name: 'Unknown User',
        email: null
      };
    }
    
    const reportData = {
      id,
      kebun: data.kebun,
      afdeling: data.afdeling,
      blok: data.blok,
      koordinatX: data.koordinatX,
      koordinatY: data.koordinatY,
      nomorPP: data.nomorPP,
      estimasiSerangga: data.estimasiSerangga,
      tanggal: data.tanggal,
      waktu: data.waktu,
      kondisiCuaca: data.kondisiCuaca,
      rbt: data.rbt,
      imageUrl: data.imageUrl || null,
      createdBy: createdByData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const collection = this.getCollection();
    await collection.doc(id).set(reportData);

    return new Report(reportData);
  }

  static async findById(id) {
    const collection = this.getCollection();
    const doc = await collection.doc(id).get();

    if (!doc.exists) {
      throw new Error('Report not found');
    }

    return new Report({ id: doc.id, ...doc.data() });
  }

  static async findAll(limit = 28) {
    const collection = this.getCollection();
    const snapshot = await collection.orderBy('createdAt', 'desc').limit(limit).get();

    return snapshot.docs.map(doc => new Report({ id: doc.id, ...doc.data() }));
  }

  static async update(id, data) {
    const collection = this.getCollection();
    
    // Handle createdBy if it's included in update
    let updatedData = { ...data };
    if (data.createdBy) {
      if (typeof data.createdBy === 'object' && data.createdBy !== null) {
        updatedData.createdBy = {
          id: data.createdBy.id || 'anonymous',
          name: data.createdBy.name || 'Unknown User',
          email: data.createdBy.email || null
        };
      } else {
        updatedData.createdBy = {
          id: data.createdBy,
          name: 'Unknown User',
          email: null
        };
      }
    }
    
    const updateData = {
      ...updatedData,
      updatedAt: new Date()
    };

    await collection.doc(id).update(updateData);
    const doc = await collection.doc(id).get();
    return new Report({ id: doc.id, ...doc.data() });
  }

  static async delete(id) {
    const collection = this.getCollection();
    await collection.doc(id).delete();
    return true;
  }
}

export default Report;