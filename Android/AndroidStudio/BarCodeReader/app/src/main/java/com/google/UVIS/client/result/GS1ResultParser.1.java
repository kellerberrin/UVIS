/*
 * Copyright (c) 2014 kellerberrin
 * Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *     limitations under the License.
 */

/**
 * Created by kellerberrin on 18/04/2014.
 *
 * Implements the Proposed GS1 SGTIN definition for secure pharmaceutical distribution.
 *
 */

package com.google.UVIS.client.result;


import android.util.Log;

import com.google.UVIS.FormatException;
import com.google.UVIS.Result;
import com.google.UVIS.common.GS1.GS1_GTIN;


public class GS1ResultParser extends ResultParser
{

    @Override
    public GS1ParsedResult parse(Result result)
    {

        String rawText = getMassagedText(result);

        if (!GS1_GTIN.ValidGTINFormat(rawText))
        {
            return null;
        }

// Must be a valid GTIN, therefore return it.

        try
        {
            GS1_GTIN GTIN = new GS1_GTIN(rawText);
            return new GS1ParsedResult(GTIN);
        }
        catch (FormatException e)
        {
            Log.e("GS1ResultParser.parse", "Unexpected problem parsing a GTIN String:" + rawText);
            return null;
        }

    }

}


