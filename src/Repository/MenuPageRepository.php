<?php

namespace App\Repository;

/**
 * MenuPageRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class MenuPageRepository extends \Doctrine\ORM\EntityRepository
{
    public function positionMax($idMenu){
        $qb = $this
            ->createQueryBuilder('m')
            ->where('m.menu = :idMenu')
            ->setParameter('idMenu', $idMenu)
            ->orderBy('m.position', 'DESC')
            ->setMaxResults(1);

        return $qb->getQuery()->getResult()[0];
    }
}
