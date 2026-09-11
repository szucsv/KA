import 'dart:io';

void main() {
  print('Adj meg egy számot: ');
  int szam1 = int.parse(stdin.readLineSync()!);
  print('Adj meg egy számot: ');
  int szam2 = int.parse(stdin.readLineSync()!); 
  int min = szam1 < szam2 ? szam1 : szam2;
  int max = szam1 > szam2 ? szam1 : szam2;
  for (int i = min; i <= max; i++) {
    String tipus = (i % 2 == 0) ? 'páros' : 'páratlan';
    print('$i - $tipus');
  }

  List<String> uefa2024euro = [
    "Spain", "Germany", "Portugal", "France", 
    "Netherlands", "Turkey", "England", "Switzerland"
  ];
  for (int i = 0; i < uefa2024euro.length; i++) {
    print('${uefa2024euro[i]}');
  }

  for (int i = 0; i < uefa2024euro.length; i++) {
    for (int j = i + 1; j < uefa2024euro.length; j++) {
      print('${uefa2024euro[i]} - ${uefa2024euro[j]}');
    }
  }

  print('Adj meg egy számot: ');
  String bemenet4 = stdin.readLineSync()!;
  int osszeg4 = 0;
  int darab4 = 0;
  for (int i = 0; i < bemenet4.length; i++) {
    int? szamjegy = int.tryParse(bemenet4[i]);
    if (szamjegy != null) {
      osszeg4 += szamjegy;
      darab4++;
    }
  }
  if (darab4 > 0) {
    double atlag = osszeg4 / darab4;
    print('A számjegyek átlaga: ${atlag.toStringAsFixed(2)}');
  } else {
    print('Nem található érvényes számjegy.');
  }

  print('Adj meg egy számot: ');
  String bemenet5 = stdin.readLineSync()!;
  print('A számjegyek négyzetei: ');
  for (int i = 0; i < bemenet5.length; i++) {
    int? szamjegy = int.tryParse(bemenet5[i]);
    if (szamjegy != null) {
      print('${szamjegy * szamjegy} ');
    }
  }
  print(''); 

  print('Írj be egy szöveget: ');
  String szoveg6 = stdin.readLineSync()!;
  String mghNelkul = szoveg6.replaceAll(RegExp(r'[aeiou]'),'');
  print('Magánhangzók nélkül: $mghNelkul');

  print('Írj be egy szöveget: ');
  String szoveg7 = stdin.readLineSync()!;
  for (int i = 0; i < szoveg7.length; i++) {
    String betu = szoveg7[i];
    print('($betu, ${betu.codeUnitAt(0)})');
  }

  for (int i = 1; i <= 100; i++) {
    if (i % 3 == 0 && i % 5 == 0) {
      print('FizzBuzz');
    } else if (i % 3 == 0) {
      print('Fizz');
    } else if (i % 5 == 0) {
      print('Buzz');
    } else {
      print(i);
    }
  }

    for (int i = 1; i <= 6; i++) {
    for (int j = 1; j <= 6; j++) {
      if (i * j == 9) {
        print('A szorzat 9 (i=$i, j=$j)');
        break; 
      }
      print('i=$i, j=$j, szorzat=${i * j}');
    }
  }

  kulsoCikulus:
  for (int i = 1; i <= 6; i++) {
    for (int j = 1; j <= 6; j++) {
      if (i * j == 9) {
        print('A szorzat 9 (i=$i, j=$j)');
        break kulsoCikulus; 
      }
      print('i=$i, j=$j, szorzat=${i * j}');
    }
  }
}