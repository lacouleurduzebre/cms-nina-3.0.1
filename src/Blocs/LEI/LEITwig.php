<?php
/**
 * Created by PhpStorm.
 * User: Chipolata
 * Date: 17/07/2018
 * Time: 13:35
 */

namespace App\Blocs\LEI;


use App\Entity\Bloc;
use App\Service\Pagination;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Twig\Environment;

class LEITwig extends \Twig_Extension
{
    public function __construct(RegistryInterface $doctrine, Pagination $pagination)
    {
        $this->doctrine = $doctrine;
        $this->pagination = $pagination;
    }

    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('listeLEI', array($this, 'listeLEI')),
        );
    }

    public function listeLEI($parametres)
    {
        $flux = $parametres['flux'];
        $cle = $parametres['clef_moda'];

        $xml = simplexml_load_file($flux);
        $fiches = $xml->xpath("//Resultat/sit_liste");

        //Limitation à la clé de modalité
        if(isset($cle)){
            $fichesTriees = [];

            foreach($fiches as $fiche){
                $criteres = $fiche->CRITERES->Crit;
                foreach($criteres as $critere){
                    $attribute = $critere->attributes()['CLEF_MODA'];
                    if($attribute == $cle){
                        $fichesTriees[] = $fiche;
                        break;
                    }
                }
            }

            $fiches =  $fichesTriees;
        }

        $page = isset($_GET['page']) ? $_GET['page'] : 1;

        return $this->pagination->getPagination($fiches, $parametres, $page);
    }
}