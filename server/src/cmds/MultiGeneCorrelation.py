# -*- coding: utf-8 -*-
"""
Created on Mon Sep  5 12:19:00 2022

@author: rbarreror
"""

#
# IMPORT LIBRARIES
#
import argparse
import logging
import numpy as np
import os
import pandas as pd
import re
from scipy import stats
import sys
import simplejson

os.chdir(r'S:\U_Proteomica\UNIDAD\software\MacrosRafa\data\Proteomics\GroupTools\MiCoDIS\server')

#
# MAIN
# 
def main(args):
    '''
    Main function
    '''
    idx = pd.IndexSlice
    
    #
    # Read files with data
    #
    try:
        data = pd.read_feather(os.path.join(args.i, args.sp, 'gene_count_score.feather'))
        data.columns = pd.MultiIndex.from_tuples([i.split('&') for i in data.columns])
    
        # read gene to class json
        with open(os.path.join(args.i, args.sp, 'c2g.json'), 'r') as f:
            g2c = simplejson.load(f)
            cl = g2c.keys()
    
    except Exception:
        logging.exception('Error reading input files')
        sys.exit(100)
    
    #
    # Detect category and get (unique) genes
    #
    genes = [g2c[j]['Gene'] for i in args.g for j in cl if re.search(f'^{i}$', j, re.IGNORECASE)]
    genes = list(set([j for i in genes for j in i] + [i for i in args.g if i in data[('LEVEL', 'Gene')].to_list()]))
    
    #
    # Calculate median
    #
    try:
        genes_bool = np.isin(data[('LEVEL', 'Gene')], genes)
        
        data_ref = {
         s: { 
             j: data.loc[
                 np.logical_and(genes_bool, data[('LEVEL', 'Tissue')] == s),
                 idx[[j], :]
                 ].median().to_numpy()
             for j in ['count', 'q_score']
                 }
         for s in args.s
         }
        
    except Exception:
        logging.exception('Error calculating median')
        sys.exit(101)
    
    #
    # Calculate correlation
    #
    try:
        st = {
              s: {
                  i: [
                      stats.spearmanr(
                          data_ref[s][i],
                          row,
                          axis=1,
                          #nan_policy='omit'
                          )
                       for row in data.loc[:, idx[i]][data[('LEVEL', 'Tissue')] == s].to_numpy()
                      ]
                  for i in ['count', 'q_score']
                  }
              for s in args.s
              }

    except Exception:
        logging.exception('Error calculating correlation')
        sys.exit(102)
        
    #
    # Obtain output format
    #
    try:
        st = {
         s: {
             i: list(zip(*[(j.correlation, j.pvalue) for j in st[s][i]]))
             for i in st[s]
             }
         for s in st
         }
        
        st = {
         s: list(zip(st[s]['count'][0],st[s]['q_score'][0],st[s]['count'][1],st[s]['q_score'][1]))
         for s in st
         }
        
        st_genes = {
            s: data[('LEVEL', 'Gene')][data[('LEVEL', 'Tissue')] == s].to_list()
            for s in args.s
            }
        
        
        out_json = [
            {
                'tissue': s,
                'organism': args.sp,
                'gene': '&'.join(sorted(args.g)),
                'values': {g: list(val) for g,val in zip(st_genes[s], st[s])}
                }
            for s in args.s
            ]
        
    except Exception:
        logging.exception('Error Obtaining output format')
        sys.exit(103)
    
    entry = simplejson.dumps(out_json, ignore_nan=True)
    print(entry)

        
if __name__ == '__main__':

    # ArgumentParser    
    parser = argparse.ArgumentParser(description='Calculate correlation using a set of genes')

    parser.add_argument('-i', dest='i', help='Path to files with data')
    parser.add_argument('-g', '--gene-list', dest='g', nargs='+', type=str, help='Array of genes used to calculate joined correlation')
    parser.add_argument('-s', '--sample-list', dest='s', nargs='+', type=str, default=None, help='Array of samples/tissue used in which calculate correlation')
    parser.add_argument('-sp', dest='sp', type=str, help='Specie used to obtain correlation')
    #parser.add_argument('-o', dest='o', help='Path to output results')
    
    args = parser.parse_args()
    
    # Logging config
    logging.basicConfig(
        level=logging.INFO,
        format=str(os.getpid())+' - %(asctime)s - %(levelname)s - %(message)s',
        datefmt='%m/%d/%Y %I:%M:%S %p',
        handlers=[logging.StreamHandler(sys.stderr)]
        )

    # Execute main
    logging.info('START MAIN: '+"{0}".format(" ".join([x for x in sys.argv])))
    main(args)   
    logging.info('END MAIN')

    