// imports
import java.io.File;
import java.io.PrintWriter;
import java.util.Scanner;

/**
 * A Showdown Parser for personal use. Might update
 * to use a url call for more hands-off-ness someday
 */
public class ShowdownParser {
    
    public static void parseDex(){
        // denotes end of ScarVi Pokedex (Pecharunt)
        boolean end = false;
        // name to write out to parsed file
        String pokemonName = "";

        File src = new File("showdownPokedex.txt");
        // Try and scan through the Showdown dex
        try(Scanner scnr = new Scanner(src)){
            File outputFile = new File("parsedDex.txt");
            outputFile.createNewFile();
            PrintWriter pw = new PrintWriter(outputFile);
            String currLine = "";
            while(scnr.hasNextLine() && end != true){
                currLine = scnr.nextLine();
                if(currLine.contains("pecharunt")){
                    end = true;
                }
                String name = "name: \"";
                // Get name
                if(currLine.contains("name: \"")){
                    pokemonName = currLine.trim();
                    pokemonName = pokemonName.substring(7);
                    pokemonName = pokemonName.substring(0);
                    String copy = pokemonName;
                    copy = copy.substring(0, copy.length()-2);
                    System.out.println(copy);
                    pw.println(copy);
                }
            }
            // Duct-tape fix... if I did the next Pokemon
            //(missingno) for the if currLine contains,
            // it would include it, but if I do Pecha, it
            // is not included... whatever
            pw.println("Pecharunt");
            System.out.println("Pecharunt");
            pw.close();
            System.out.println("\n" + "Done");
        } catch (Exception e){
            e.printStackTrace();
        }
   }

    public static void main(String[] args) {
        parseDex();
    }
    }