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

package com.google.UVIS.client.result;


/**
 * Created by kellerberrin on 20/04/2014.
 * Subclass the ParsedResult to pass back a parsed GTIN
 * from a barcode scan operation.
 */

import android.util.Log;

import com.google.UVIS.FormatException;
import com.google.UVIS.common.GS1.GS1_GTIN;
import com.google.UVIS.common.GS1.GS1_GTIN_NDC;

public class GS1ParsedResult extends ParsedResult
{

    private GS1_GTIN m_GS1_GTIN;

    GS1ParsedResult(GS1_GTIN GTIN)
    {
        super(ParsedResultType.GTIN);
        SetGTIN(GTIN);
    }

    GS1ParsedResult(GS1ParsedResult Copy)
    {
        super(ParsedResultType.GTIN);
        SetGTIN(Copy.GetGTIN());
    }

    public final GS1_GTIN GetGTIN() { return m_GS1_GTIN; }
    private void SetGTIN(GS1_GTIN GTIN) { m_GS1_GTIN = GTIN; }

    @Override
    public String getDisplayResult()
    {
        StringBuilder result = new StringBuilder(100);
        maybeAppend("GTIN :" + GetGTIN().GetGTINString(), result);
        if (GS1_GTIN_NDC.ValidGTINNDCFormat(GetGTIN().GetGTINString()))
        {
            try
            {
                GS1_GTIN_NDC GTIN_NDC = new GS1_GTIN_NDC(GetGTIN().GetGTINString());
                maybeAppend("NDC(10):" + GTIN_NDC.GetNDC().FormattedNDC(), result);

            } catch (FormatException e)
            {
                Log.e( "GS1ParsedResult::getDisplayResult"
                     , "Unexpected error constructing GS1_GTIN_NDC object");
            }

        }

        return result.toString();

    }

}
