export const characterIdByName: Record<string,string> = {
 "Hanumān":"hanuman","Rāma":"rama","Aṅgada":"angada","Jāmbavān":"jambavan","Vanara search party":"vanara-search-party",
 "Sampāti":"sampati","Maināka":"mainaka","Surasā":"surasa","Siṃhikā":"simhika","Laṅkinī":"lankini","Vibhīṣaṇa":"vibhishana",
 "Sītā":"sita","Trijaṭā":"trijata","Rākṣasī guards":"raksasi-guards","Kiṅkaras":"kinkaras","Jambumālī":"jambumali",
 "Seven Sons of the Ministers":"seven-ministers-sons","Virūpākṣa":"virupaksha","Yūpākṣa":"yupaksha","Durdhara":"durdhara",
 "Praghasa":"praghasa","Bhāsakarṇa":"bhasakarna","Akṣa Kumāra":"aksha-kumara","Indrajit":"indrajit","Rāvaṇa":"ravana",
 "Lakṣmaṇa":"lakshmana","Sugrīva":"sugriva",
};
export const characterNameById=Object.fromEntries(Object.entries(characterIdByName).map(([name,id])=>[id,name]));
